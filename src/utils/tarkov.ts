export const getFleaMarketFees = (_rewardsTotal: number, _basePrice: number) => {
  const V0 = _basePrice;
  const VR = _rewardsTotal;
  const P0 = VR >= V0 ? Math.log10(V0 / VR) : Math.pow(Math.log10(V0 / VR), 1.08);
  const PR = VR <= V0 ? Math.log10(VR / V0) : Math.pow(Math.log10(VR / V0), 1.08);
  const Q = 1;
  const TI = 0.03;
  const TR = 0.03;
  return Math.round(V0 * TI * Math.pow(4, P0) * Q + VR * TR * Math.pow(4, PR) * Q);
};

export const getMaxFleaMarketProfits = (_basePrice: number, _discount = 0) => {
  const profitCalculator: any = (startReward: number, endReward: number) => {
    if (endReward - startReward < 2) {
      return startReward;
    }
    const positionReward = Math.round((startReward + endReward) / 2);
    const ps = Math.round((startReward + positionReward) / 2);
    const profitSmaller = ps - getFleaMarketFees(ps, _basePrice) * (1 - _discount);
    const pl = Math.round((endReward + positionReward) / 2);
    const profitLarger = pl - getFleaMarketFees(pl, _basePrice) * (1 - _discount);
    if (profitSmaller > profitLarger) {
      return profitCalculator(startReward, positionReward);
    } else {
      return profitCalculator(positionReward, endReward);
    }
  };
  return profitCalculator(_basePrice, Math.pow(2, 31));
};

export const calculatePenetration = (props: {
  durability: number;
  class: number;
  penetration: number;
}) => {
  const d = props.durability;
  const c = props.class;
  const p = props.penetration;
  const a = (121 - 5000 / (45 + d * 2)) * c / 10;
  if (a - 15 < p && p < a) {
    return 0.4 * Math.pow(a - p - 15, 2) / 100;
  } else if (a <= p) {
    return (100 + p / (0.9 * a - p)) / 100;
  } else {
    return 0;
  }
};

export const quaternionToEulerAngles = (q: number[]) => {
  const x = q[0];
  const z = q[1];
  const y = q[2];
  const w = q[3];

  let roll = Math.atan2(2 * (w * x + y * z), 1 - 2 * (x * x + y * y));
  let pitch = Math.asin(Math.max(Math.min(2 * (w * y - z * x), 1), -1));
  let yaw = Math.atan2(2 * (w * z + x * y), 1 - 2 * (y * y + z * z));

  roll = roll * 180 / Math.PI;
  pitch = pitch * 180 / Math.PI;
  yaw = yaw * 180 / Math.PI;

  return [yaw, pitch, roll];
};
