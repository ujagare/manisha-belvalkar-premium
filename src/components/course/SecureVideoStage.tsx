"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  CircleAlert,
  Clock,
  HeadphoneOff,
  Headphones,
  InspectionPanel,
  IterationCw,
  Loader2,
  Play,
  PlayCircle,
  RefreshCw,
  RotateCcw,
  ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface WatermarkDisplay {
  primaryText: string;
  secondaryText: string;
  fingerprintCode: string;
}

export type PlaybackDescriptor =
  | {
      ready: false;
      watermark: WatermarkDisplay;
      sessionId: string;
    }
  | {
      ready: true;
      mode: "vdocipher";
      otp: string;
      playbackInfo: string;
      watermark: WatermarkDisplay;
      sessionId: string;
      tokenExpiresAt: number;
    }
  | {
      ready: true;
      mode: "bunny";
      embedUrl: string;
      watermark: WatermarkDisplay;
      sessionId: string;
      tokenExpiresAt: number;
    }
  | {
      ready: true;
      mode: "vault_stream";
      streamUrl: string;
      watermark: WatermarkDisplay;
      sessionId: string;
      tokenExpiresAt: number;
    };

const WATERMARK_POSITIONS = [
  { top: "10%", left: "8%" },
  { top: "14%", left: "56%" },
  { top: "38%", left: "14%" },
  { top: "44%", left: "58%" },
  { top: "68%", left: "10%" },
  { top: "66%", left: "54%" },
  { top: "24%", left: "34%" },
  { top: "54%", left: "32%" },
];

const PLAYBACK_SPEEDS = [0.75, 1, 1.25, 1.5, 1.75, 2];

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const s = Math.floor(seconds);
  const hrs = Math.floor(s / 3600);
  const mins = Math.floor((s % 3600) / 60);
  const secs = s % 60;
  if (hrs > 0) {
    return `${hrs}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

export default function SecureVideoStage({
  lessonTitle,
  posterImage,
  playback,
  loading,
  error,
  initialWatchedSeconds = 0,
  onRetry,
  onTimeProgress,
  onNearlyComplete,
  onSecurityEvent,
}: {
  lessonTitle: string;
  posterImage?: string;
  playback: PlaybackDescriptor | null;
  loading: boolean;
  error: string | null;
  initialWatchedSeconds?: number;
  onRetry: () => void;
  onTimeProgress: (watchedSeconds: number) => void;
  onNearlyComplete: () => void;
  onSecurityEvent: (eventType: string, metadata?: Record<string, string | number | boolean>) => void;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);
  const nearlyCompleteFiredRef = useRef(false);
  const restoredSeekRef = useRef(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bufferedEnd, setBufferedEnd] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [wmIndex, setWmIndex] = useState(0);
  const [clockLabel, setClockLabel] = useState("");
  const [shieldMessage, setShieldMessage] = useState<string | null>(null);
  const [tamperLocked, setTamperLocked] = useState(false);

  // Reset per-lesson playback flags when playback descriptor changes
  useEffect(() => {
    nearlyCompleteFiredRef.current = false;
    restoredSeekRef.current = false;
    const resetTimer = window.setTimeout(() => {
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      setBufferedEnd(0);
      setShieldMessage(null);
    }, 0);
    return () => window.clearTimeout(resetTimer);
  }, [lessonTitle]);

  // Rotate dynamic watermark coordinates every 5.5 seconds + refresh forensic clock
  useEffect(() => {
    const updateClock = () => {
      setClockLabel(
        new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    };
    updateClock();
    const interval = window.setInterval(() => {
      setWmIndex((prev) => (prev + 1 + Math.floor(Math.random() * 3)) % WATERMARK_POSITIONS.length);
      updateClock();
    }, 5500);
    return () => window.clearInterval(interval);
  }, []);

  const pauseWithShield = useCallback(
    (reason: string, eventType?: string) => {
      if (videoRef.current && !videoRef.current.paused) {
        videoRef.current.pause();
      }
      setIsPlaying(false);
      setShieldMessage(reason);
      if (eventType) {
        onSecurityEvent(eventType, { reason });
      }
    },
    [onSecurityEvent],
  );

  // DOM Tamper Watchdog: pauses & locks video if user deletes/hides watermark via DevTools
  useEffect(() => {
    if (!stageRef.current || !playback?.ready) return;
    const observer = new MutationObserver(() => {
      const wm = watermarkRef.current;
      if (!wm || !stageRef.current?.contains(wm)) {
        if (videoRef.current) videoRef.current.pause();
        setTamperLocked(true);
        onSecurityEvent("watermark_tampered", { detail: "node_removed" });
        return;
      }
      const computed = window.getComputedStyle(wm);
      if (
        computed.display === "none" ||
        computed.visibility === "hidden" ||
        Number.parseFloat(computed.opacity) < 0.12
      ) {
        if (videoRef.current) videoRef.current.pause();
        setTamperLocked(true);
        onSecurityEvent("watermark_tampered", { detail: "style_hidden" });
      }
    });

    observer.observe(stageRef.current, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class", "hidden"],
    });

    return () => observer.disconnect();
  }, [onSecurityEvent, playback]);

  // Capture / Screenshot / DevTools Shortcut & Tab Visibility Shield
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      // Block PrintScreen, macOS Cmd+Shift+3/4/5, Win+Alt+R, Save Page, View Source, DevTools
      const isCaptureShortcut =
        e.key === "PrintScreen" ||
        (e.metaKey && e.shiftKey && ["3", "4", "5"].includes(key)) ||
        (e.metaKey && e.altKey && key === "r");
      const isInspectShortcut =
        e.key === "F12" ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && ["i", "j", "c"].includes(key)) ||
        ((e.ctrlKey || e.metaKey) && ["s", "u"].includes(key));

      if (isCaptureShortcut) {
        e.preventDefault();
        pauseWithShield(
          "Screen capture and recording shortcuts are disabled to protect course content.",
          "capture_shortcut_blocked",
        );
      } else if (isInspectShortcut) {
        e.preventDefault();
        pauseWithShield(
          "Developer inspection and media saving shortcuts are restricted inside the classroom.",
          "devtools_detected",
        );
      }
    };

    const onVisibilityChange = () => {
      if (document.hidden && videoRef.current && !videoRef.current.paused) {
        videoRef.current.pause();
        setIsPlaying(false);
        setShieldMessage("Playback paused while tab was in the background. Click Resume to continue.");
      }
    };

    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    window.addEventListener("keydown", onKeyDown, { capture: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => {
      window.removeEventListener("keydown", onKeyDown, { capture: true });
      document.removeEventListener("visibilitychange", onVisibilityChange);
      document.removeEventListener("fullscreenchange", onFullscreenChange);
    };
  }, [pauseWithShield]);

  // Block Picture-in-Picture via native DOM event listener
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    const onPip = () => {
      if (document.pictureInPictureElement) {
        void document.exitPictureInPicture().catch(() => null);
      }
      onSecurityEvent("pip_or_cast_blocked");
    };
    vid.addEventListener("enterpictureinpicture", onPip);
    return () => vid.removeEventListener("enterpictureinpicture", onPip);
  }, [onSecurityEvent, playback]);

  // Keep stream URL updated seamlessly during token rotation without losing playback position
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !playback?.ready || playback.mode !== "vault_stream") return;
    if (!video.src) {
      video.src = playback.streamUrl;
      return;
    }
    // Only swap active src immediately if video is paused or ended so playback never stutters
    if (video.paused && !video.src.endsWith(playback.streamUrl)) {
      const savedTime = video.currentTime;
      video.src = playback.streamUrl;
      video.currentTime = savedTime;
    }
  }, [playback]);

  function togglePlay() {
    if (tamperLocked) return;
    setShieldMessage(null);
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play().catch(() => {
        setIsPlaying(false);
      });
    } else {
      video.pause();
    }
  }

  function skipSeconds(delta: number) {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration)) return;
    video.currentTime = Math.max(0, Math.min(video.duration, video.currentTime + delta));
  }

  function cycleSpeed() {
    const next = PLAYBACK_SPEEDS[(PLAYBACK_SPEEDS.indexOf(speed) + 1) % PLAYBACK_SPEEDS.length];
    setSpeed(next);
    if (videoRef.current) {
      videoRef.current.playbackRate = next;
    }
  }

  function toggleMute() {
    const next = !muted;
    setMuted(next);
    if (videoRef.current) {
      videoRef.current.muted = next;
    }
  }

  async function toggleFullscreen() {
    if (!stageRef.current) return;
    try {
      if (!document.fullscreenElement) {
        // Fullscreen on the wrapper stage keeps the forensic watermark visible in fullscreen!
        await stageRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      /* Ignore fullscreen permission rejection */
    }
  }

  function handleStageKeys(e: React.KeyboardEvent<HTMLDivElement>) {
    if (["INPUT", "TEXTAREA", "SELECT"].includes((e.target as HTMLElement)?.tagName)) return;
    if (e.key === " " || e.key.toLowerCase() === "k") {
      e.preventDefault();
      togglePlay();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      skipSeconds(-10);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      skipSeconds(10);
    } else if (e.key.toLowerCase() === "m") {
      e.preventDefault();
      toggleMute();
    } else if (e.key.toLowerCase() === "f") {
      e.preventDefault();
      void toggleFullscreen();
    }
  }

  const wmPos = WATERMARK_POSITIONS[wmIndex];
  const watermark = playback?.watermark;

  return (
    <div
      ref={stageRef}
      tabIndex={0}
      onKeyDown={handleStageKeys}
      onContextMenu={(e) => {
        e.preventDefault();
        onSecurityEvent("context_menu_blocked");
      }}
      onDragStart={(e) => e.preventDefault()}
      aria-label={`Protected video player: ${lessonTitle}`}
      className="group relative aspect-video w-full select-none overflow-hidden rounded-2xl bg-[#12100e] shadow-2xl shadow-charcoal/25 outline-none focus-visible:ring-2 focus-visible:ring-gold"
    >
      {/* Loading Skeleton */}
      {loading ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[#161311] text-white">
          <Loader2 className="h-8 w-8 animate-spin text-gold-light" />
          <p className="text-xs font-medium tracking-wider text-white/70">
            Initializing encrypted classroom stream…
          </p>
        </div>
      ) : error ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[#181311] px-6 text-center text-white">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-primary/25 text-gold-light ring-1 ring-gold/30">
            <CircleAlert className="h-7 w-7" />
          </span>
          <p className="max-w-md font-display text-lg font-semibold text-white">
            Playback paused
          </p>
          <p className="max-w-md text-xs leading-5 text-white/70">{error}</p>
          <button
            type="button"
            onClick={onRetry}
            className="mt-1 inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-xs font-bold text-[#1c1917] transition hover:bg-gold-light"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Retry secure stream
          </button>
        </div>
      ) : tamperLocked ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[#1a0d0d] px-6 text-center text-white">
          <ShieldAlert className="h-10 w-10 text-[#f0d060]" />
          <p className="font-display text-xl font-semibold">
            Security Tamper Detected
          </p>
          <p className="max-w-md text-xs leading-5 text-white/75">
            Modifying player overlays or inspection hooks violates anti-piracy protection. Reload the page to restore normal playback.
          </p>
        </div>
      ) : !playback || !playback.ready ? (
        <div className="relative flex h-full w-full items-center justify-center bg-[#181412]">
          {posterImage ? (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-15 blur-sm"
              style={{ backgroundImage: `url('${posterImage}')` }}
            />
          ) : null}
          <div className="relative px-6 text-center text-white">
            <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gold/15 ring-1 ring-gold/35">
              <PlayCircle className="h-8 w-8 text-gold-light" />
            </span>
            <p className="mt-4 font-display text-xl font-semibold">{lessonTitle}</p>
            <p className="mt-1.5 text-xs text-white/60">
              Recorded lecture · Protected video will appear here once uploaded in Course Studio
            </p>
          </div>
        </div>
      ) : playback.mode === "vdocipher" ? (
        <iframe
          src={`https://player.vdocipher.com/v2/?otp=${encodeURIComponent(playback.otp)}&playbackInfo=${encodeURIComponent(playback.playbackInfo)}`}
          title={lessonTitle}
          allow="encrypted-media; fullscreen"
          allowFullScreen
          className={cn(
            "h-full w-full border-0 transition duration-200",
            shieldMessage && " pointer-events-none blur-2xl brightness-10",
          )}
        />
      ) : playback.mode === "bunny" ? (
        <iframe
          src={playback.embedUrl}
          title={lessonTitle}
          allow="accelerometer; gyroscope; encrypted-media; fullscreen"
          allowFullScreen
          className={cn(
            "h-full w-full border-0 transition duration-200",
            shieldMessage && "pointer-events-none blur-2xl brightness-10",
          )}
        />
      ) : (
        <>
          <video
            ref={videoRef}
            poster={posterImage}
            playsInline
            preload="metadata"
            controls={false}
            controlsList="nodownload noplaybackrate noremoteplayback"
            disablePictureInPicture
            disableRemotePlayback
            onClick={togglePlay}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onLoadedMetadata={(e) => {
              const vid = e.currentTarget;
              setDuration(vid.duration || 0);
              vid.playbackRate = speed;
              vid.muted = muted;
              if (
                !restoredSeekRef.current &&
                initialWatchedSeconds > 5 &&
                vid.duration > initialWatchedSeconds + 8
              ) {
                vid.currentTime = initialWatchedSeconds;
              }
              restoredSeekRef.current = true;
            }}
            onTimeUpdate={(e) => {
              const vid = e.currentTarget;
              setCurrentTime(vid.currentTime);
              onTimeProgress(vid.currentTime);
              if (vid.buffered.length > 0) {
                setBufferedEnd(vid.buffered.end(vid.buffered.length - 1));
              }
              if (
                !nearlyCompleteFiredRef.current &&
                vid.duration > 20 &&
                vid.currentTime / vid.duration >= 0.9
              ) {
                nearlyCompleteFiredRef.current = true;
                onNearlyComplete();
              }
            }}
            onError={() => {
              // Automatically re-request fresh signed token if token expired mid-seek
              onRetry();
            }}
            className={cn(
              "h-full w-full cursor-pointer bg-black object-contain transition duration-200",
              shieldMessage && "blur-2xl brightness-10",
            )}
          />

          {/* Center Play Overlay when paused */}
          {!isPlaying && !shieldMessage ? (
            <button
              type="button"
              onClick={togglePlay}
              aria-label="Play lecture"
              className="absolute inset-0 z-20 grid place-items-center bg-black/25 transition hover:bg-black/35"
            >
              <span className="grid h-16 w-16 place-items-center rounded-full bg-primary/90 text-white shadow-xl ring-2 ring-gold/50 transition-transform duration-200 hover:scale-105">
                <Play className="ml-0.5 h-7 w-7 fill-current" />
              </span>
            </button>
          ) : null}

          {/* Custom Anti-Download Classroom Control Bar */}
          <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/90 via-black/55 to-transparent px-3 pb-3 pt-8 opacity-100 transition-opacity duration-200 sm:px-5 sm:pb-4 lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100">
            {/* Progress Scrubber */}
            <div className="relative mb-2.5 flex items-center">
              <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/20">
                <div
                  className="absolute inset-y-0 left-0 bg-white/30"
                  style={{
                    width: duration ? `${Math.min(100, (bufferedEnd / duration) * 100)}%` : "0%",
                  }}
                />
                <div
                  className="absolute inset-y-0 left-0 bg-[#f0d060]"
                  style={{
                    width: duration ? `${Math.min(100, (currentTime / duration) * 100)}%` : "0%",
                  }}
                />
              </div>
              <input
                type="range"
                aria-label="Seek lecture timeline"
                min={0}
                max={duration || 100}
                step={1}
                value={currentTime}
                onChange={(e) => {
                  const next = Number(e.target.value);
                  setCurrentTime(next);
                  if (videoRef.current) videoRef.current.currentTime = next;
                }}
                className="absolute inset-0 h-4 w-full cursor-pointer opacity-0"
              />
            </div>

            <div className="flex items-center justify-between gap-2 text-xs text-white">
              <div className="flex items-center gap-1.5 sm:gap-2.5">
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label={isPlaying ? "Pause" : "Play"}
                  className="grid h-8 w-8 place-items-center rounded-full bg-white/10 transition hover:bg-white/20"
                >
                  {isPlaying ? (
                    <span className="flex items-center gap-1" aria-hidden="true">
                      <span className="h-3.5 w-1 rounded-xs bg-white" />
                      <span className="h-3.5 w-1 rounded-xs bg-white" />
                    </span>
                  ) : (
                    <Play className="ml-0.5 h-4 w-4 fill-current" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => skipSeconds(-10)}
                  aria-label="Rewind 10 seconds"
                  className="grid h-8 w-8 place-items-center rounded-full bg-white/10 transition hover:bg-white/20"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => skipSeconds(10)}
                  aria-label="Forward 10 seconds"
                  className="grid h-8 w-8 place-items-center rounded-full bg-white/10 transition hover:bg-white/20"
                >
                  <IterationCw className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={muted ? "Unmute" : "Mute"}
                  className="grid h-8 w-8 place-items-center rounded-full bg-white/10 transition hover:bg-white/20"
                >
                  {muted ? (
                    <HeadphoneOff className="h-4 w-4 text-[#f0d060]" />
                  ) : (
                    <Headphones className="h-4 w-4" />
                  )}
                </button>
                <span className="ml-1 font-mono text-[11px] tabular-nums text-white/85">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={cycleSpeed}
                  aria-label={`Playback speed ${speed}x`}
                  className="inline-flex h-8 items-center gap-1 rounded-full bg-white/10 px-2.5 font-mono text-[11px] font-semibold text-white transition hover:bg-white/20"
                >
                  <Clock className="h-3.5 w-3.5 text-[#f0d060]" />
                  {speed}x
                </button>
                <button
                  type="button"
                  onClick={() => void toggleFullscreen()}
                  aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                  className="inline-flex h-8 items-center gap-1 rounded-full bg-white/10 px-2.5 text-[11px] font-semibold text-white transition hover:bg-white/20"
                >
                  <InspectionPanel className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{isFullscreen ? "Exit" : "Full"}</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Dynamic Moving Forensic Watermark (Active across normal & fullscreen!) */}
      {watermark && playback?.ready && !tamperLocked ? (
        <div
          ref={watermarkRef}
          aria-hidden="true"
          style={{ top: wmPos.top, left: wmPos.left }}
          className="pointer-events-none absolute z-30 max-w-[76%] select-none rounded-md bg-black/22 px-2.5 py-1 text-left backdrop-blur-[1px] transition-all duration-700"
        >
          <p className="truncate font-mono text-[10px] font-semibold tracking-wide text-white/45 sm:text-[11px]">
            {watermark.primaryText}
          </p>
          <p className="truncate font-mono text-[9px] tracking-wider text-[#f0d060]/45 sm:text-[10px]">
            {watermark.secondaryText} · {clockLabel}
          </p>
        </div>
      ) : null}

      {/* Capture / Focus Protection Curtain */}
      {shieldMessage && !tamperLocked ? (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-3 bg-black/88 px-6 text-center text-white">
          <ShieldAlert className="h-9 w-9 text-[#f0d060]" />
          <p className="max-w-md text-xs leading-5 text-white/85 sm:text-sm">
            {shieldMessage}
          </p>
          <button
            type="button"
            onClick={() => {
              setShieldMessage(null);
              togglePlay();
            }}
            className="mt-1 inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2 text-xs font-bold text-[#1c1917] transition hover:bg-gold-light"
          >
            <Play className="h-3.5 w-3.5 fill-current" /> Resume lecture
          </button>
        </div>
      ) : null}
    </div>
  );
}
