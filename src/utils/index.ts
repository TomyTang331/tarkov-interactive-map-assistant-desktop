export const timeFormat = (time: number, suffix = '') => {
  const scale = [
    1000 * 60,
    1000 * 60 * 60,
    1000 * 60 * 60 * 24,
    1000 * 60 * 60 * 24 * 30,
  ];
  if (time < scale[0]) {
    return `${Math.round(time / 1000)} 秒${suffix}`;
  } else if (time < scale[1]) {
    return `${Math.round(time / scale[0])} 分钟${suffix}`;
  } else if (time < scale[2]) {
    return `${Math.round(time / scale[1])} 小时${suffix}`;
  } else if (time < scale[3]) {
    return `${Math.round(time / scale[2])} 天${suffix}`;
  } else {
    return `${Math.round(time / scale[3])} 月${suffix}`;
  }
};

export const timeDiffFormat = (time: number) => {
  return timeFormat(time, ' 前');
};
