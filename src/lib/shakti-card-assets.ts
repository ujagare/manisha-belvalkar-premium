export const SHAKTI_CARD_COUNT = 52;

export function shaktiCardImagePath(cardNumber: number) {
  if (!Number.isInteger(cardNumber) || cardNumber < 1 || cardNumber > SHAKTI_CARD_COUNT) {
    throw new RangeError(`Shakti card number must be between 1 and ${SHAKTI_CARD_COUNT}.`);
  }

  return `/images/shakti-cards/card-${cardNumber}.webp`;
}
