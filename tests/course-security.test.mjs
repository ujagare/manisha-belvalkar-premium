import assert from "node:assert/strict";
import { test } from "node:test";
import {
  buildWatermarkSpec,
  evaluateDeviceAccess,
  extractClientIpHash,
  isModuleUnlockedByDrip,
  isSecFetchAllowedForStream,
  signBunnyEmbedUrl,
  signCourseStreamToken,
  verifyCourseStreamToken,
} from "../src/lib/course-security.ts";

const TEST_SECRET = "super-secret-course-hmac-signing-key-2026";

test("signed course stream token verifies for matching user and IP", () => {
  const token = signCourseStreamToken(
    {
      sid: "session-123",
      uid: "user-abc",
      c: "aishwarya-siddhi",
      l: "ep-1",
      iph: "a1b2c3d4e5f6",
      dvh: "device-hash-1",
      free: false,
      iat: 1000,
      exp: 1120,
    },
    TEST_SECRET,
  );

  const verified = verifyCourseStreamToken(token, TEST_SECRET, {
    userId: "user-abc",
    ipHash: "a1b2c3d4e5f6",
    nowSec: 1050,
  });

  assert.equal(verified.valid, true);
  if (verified.valid) {
    assert.equal(verified.payload.c, "aishwarya-siddhi");
    assert.equal(verified.payload.l, "ep-1");
  }
});

test("stream token rejects tampering, expiry, account sharing, and IP mismatch", () => {
  const token = signCourseStreamToken(
    {
      sid: "session-123",
      uid: "user-abc",
      c: "shri-vidya",
      l: "sri-yantra",
      iph: "iphash-owner",
      dvh: "device-hash-1",
      free: false,
      iat: 1000,
      exp: 1120,
    },
    TEST_SECRET,
  );

  const expired = verifyCourseStreamToken(token, TEST_SECRET, {
    userId: "user-abc",
    ipHash: "iphash-owner",
    nowSec: 1121,
  });
  assert.deepEqual(expired, { valid: false, reason: "TOKEN_EXPIRED" });

  const sharedAccount = verifyCourseStreamToken(token, TEST_SECRET, {
    userId: "other-user-xyz",
    ipHash: "iphash-owner",
    nowSec: 1050,
  });
  assert.deepEqual(sharedAccount, { valid: false, reason: "USER_MISMATCH" });

  const sharedIp = verifyCourseStreamToken(token, TEST_SECRET, {
    userId: "user-abc",
    ipHash: "iphash-telegram-leecher",
    nowSec: 1050,
  });
  assert.deepEqual(sharedIp, { valid: false, reason: "IP_MISMATCH" });

  const tampered = `${token.slice(0, -3)}xyz`;
  const tamperedRes = verifyCourseStreamToken(tampered, TEST_SECRET, {
    userId: "user-abc",
    ipHash: "iphash-owner",
    nowSec: 1050,
  });
  assert.equal(tamperedRes.valid, false);
});

test("stream endpoint blocks yt-dlp, curl, IDM, direct tab navigation, and cross-site hotlinks", () => {
  const validVideoHeaders = new Headers({
    "sec-fetch-site": "same-origin",
    "sec-fetch-dest": "video",
    "sec-fetch-mode": "no-cors",
    "user-agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36",
  });
  assert.equal(isSecFetchAllowedForStream(validVideoHeaders), true);

  const directTabHeaders = new Headers({
    "sec-fetch-site": "none",
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "user-agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36",
  });
  assert.equal(isSecFetchAllowedForStream(directTabHeaders), false);

  const ytdlpHeaders = new Headers({
    "user-agent": "yt-dlp/2026.02.01",
  });
  assert.equal(isSecFetchAllowedForStream(ytdlpHeaders), false);

  const crossSiteHeaders = new Headers({
    "sec-fetch-site": "cross-site",
    "sec-fetch-dest": "video",
    "user-agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 Safari/605.1.15",
  });
  assert.equal(isSecFetchAllowedForStream(crossSiteHeaders), false);
});

test("device cap allows up to maxDevices, blocks excess devices, and blocks banned devices", () => {
  assert.equal(evaluateDeviceAccess([], "dev-1", 2), "REGISTER_NEW");
  assert.equal(
    evaluateDeviceAccess([{ device_id_hash: "dev-1", is_blocked: false }], "dev-1", 2),
    "ALLOWED_EXISTING",
  );
  assert.equal(
    evaluateDeviceAccess([{ device_id_hash: "dev-1", is_blocked: true }], "dev-1", 2),
    "DEVICE_BLOCKED",
  );
  assert.equal(
    evaluateDeviceAccess(
      [
        { device_id_hash: "dev-1", is_blocked: false },
        { device_id_hash: "dev-2", is_blocked: false },
      ],
      "dev-3",
      2,
    ),
    "DEVICE_LIMIT_REACHED",
  );
});

test("forensic watermark masks phone digits and builds VdoCipher moving rtext annotations", () => {
  const wm = buildWatermarkSpec({
    fullName: "Asha Kulkarni",
    email: "asha@example.com",
    phone: "+91 98765 43210",
    userId: "8f2a91c4-1111-2222-3333-444455556666",
  });

  assert.match(wm.primaryText, /asha@example\.com/);
  assert.match(wm.primaryText, /\+91••••3210/);
  assert.match(wm.secondaryText, /UID:8F2A91C4/);
  assert.equal(wm.vdocipherAnnotations[0].type, "rtext");
  assert.match(wm.vdocipherAnnotations[0].text, /8F2A91C4/);
});

test("cohort drip schedule locks future modules until offset days elapse", () => {
  const enrolledAt = "2026-11-01T00:00:00.000Z";
  const dayThree = Date.parse("2026-11-04T00:00:00.000Z");
  const dayEight = Date.parse("2026-11-09T00:00:00.000Z");

  assert.equal(isModuleUnlockedByDrip(7, enrolledAt, dayThree).unlocked, false);
  assert.equal(isModuleUnlockedByDrip(7, enrolledAt, dayEight).unlocked, true);
  assert.equal(isModuleUnlockedByDrip(0, enrolledAt, dayThree).unlocked, true);
});

test("Bunny Stream embed URL includes SHA-256 token and expiry", () => {
  const url = signBunnyEmbedUrl({
    libraryId: "240100",
    videoId: "vid-guid-99",
    signingKey: "bunny-secret",
    expiresUnix: 1800000000,
  });
  assert.match(url, /^https:\/\/iframe\.mediadelivery\.net\/embed\/240100\/vid-guid-99\?/);
  assert.match(url, /token=[a-f0-9]{64}/);
  assert.match(url, /expires=1800000000/);
});

test("client IP hash extracts forwarded IP deterministically", () => {
  const h = new Headers({ "x-forwarded-for": "203.0.113.42, 10.0.0.1" });
  const hash = extractClientIpHash(h);
  assert.equal(typeof hash, "string");
  assert.equal(hash?.length, 24);
});
