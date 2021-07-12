import { Stage, Vector } from '../common';

export const yoshisStory: Stage = {
  lines: [
    // ground
    [new Vector(-56, -3.5), new Vector(-39, 0)],
    [new Vector(-39, 0), new Vector(39, 0)],
    [new Vector(39, 0), new Vector(56, -3.5)],
    // platforms
    // [new Vector(-103.6, -33.25), new Vector(-91.7, -33.25)], Randall Start
    [new Vector(-59.5, 23.45), new Vector(-28, 23.45)],
    [new Vector(28, 23.45), new Vector(59.5, 23.45)],
    [new Vector(-15.75, 42), new Vector(15.75, 42)],
    // ceiling
    // wallL
    [new Vector(-56, -3.5), new Vector(-56, -7)],
    [new Vector(-56, -7), new Vector(-55, -8)],
    [new Vector(-55, -8), new Vector(-54, -11)],
    [new Vector(-54, -11), new Vector(-53, -12)],
    [new Vector(-53, -12), new Vector(-53, -27)],
    [new Vector(-53, -27), new Vector(-54, -28)],
    [new Vector(-54, -28), new Vector(-54, -30)],
    [new Vector(-54, -30), new Vector(-53, -31)],
    [new Vector(-53, -31), new Vector(-53, -46)],
    [new Vector(-53, -46), new Vector(-54, -47)],
    [new Vector(-54, -47), new Vector(-54, -100)],
    // wallR
    [new Vector(56, -3.5), new Vector(56, -7)],
    [new Vector(56, -7), new Vector(55, -8)],
    [new Vector(55, -8), new Vector(54, -11)],
    [new Vector(54, -11), new Vector(53, -12)],
    [new Vector(53, -12), new Vector(53, -27)],
    [new Vector(53, -27), new Vector(54, -28)],
    [new Vector(54, -28), new Vector(54, -30)],
    [new Vector(54, -30), new Vector(53, -31)],
    [new Vector(53, -31), new Vector(53, -46)],
    [new Vector(53, -46), new Vector(54, -47)],
    [new Vector(54, -47), new Vector(54, -100)],
  ],
  topRightBlastzone: new Vector(173.6, 169),
  bottomLeftBlastzone: new Vector(-175.7, -91),
  getMovingPlatforms: (frame: number) => {
    // data ported from https://github.com/altf4/libmelee which is LGPL, so this
    // must be LGPL/GPL as well. Comments are ported as well.
    const frameInLap = frame % 1200;
    const randallWidth = 11.9;

    // Top section
    if (476 < frameInLap && frameInLap < 1016) {
      const start = 101.235443115234;
      const speed = -0.35484;
      const frameInSection = frameInLap - 477;
      const y = -13.64989;
      const left = new Vector(start - randallWidth + speed * frameInSection, y);
      const right = new Vector(start + speed * frameInSection, y);
      return [[left, right]];
    }
    // Left section
    if (1022 < frameInLap && frameInLap < 1069) {
      const start = -15.2778692245483;
      const speed = -0.354839325;
      const frameInSection = frameInLap - 1023;
      const y = start + speed * frameInSection;
      const left = new Vector(-103.6, y);
      const right = new Vector(-91.7, y);
      return [[left, right]];
    }
    // Bottom section
    if (frameInLap > 1075 || frameInLap < 416) {
      const start = -101.850006103516;
      const speed = 0.35484;
      const frameInSection = frameInLap + (frameInLap < 416 ? 125 : -1076);
      const y = -33.2489;
      const left = new Vector(start + speed * frameInSection, y);
      const right = new Vector(
        start + randallWidth + speed * frameInSection,
        y,
      );
      return [[left, right]];
    }
    // Right section
    if (423 < frameInLap && frameInLap < 469) {
      const start = -31.160232543945312;
      const speed = 0.354839325;
      const frameInSection = frameInLap - 424;
      const y = start + speed * frameInSection;
      const left = new Vector(91.35, y);
      const right = new Vector(103.25, y);
      return [[left, right]];
    }

    // Here's an ugly section. But I don't know a better way to do it
    // It just hardcodes the rounded corners of Randall's location
    const position = randallCornerPositions[frameInLap];
    const y = position[0];
    const left = new Vector(position[1], y);
    const right = new Vector(position[1] + randallWidth, y);
    return [[left, right]];
  },
};

const randallCornerPositions: {
  [frameCount: number]: [y: number, xLeft: number];
} = {
  416: [-33.184478759765625, 89.75263977050781],
  417: [-33.04470443725586, 90.07878112792969],
  418: [-32.904930114746094, 90.40492248535156],
  419: [-32.76515197753906, 90.73107147216797],
  420: [-32.49260711669922, 90.92455291748047],
  421: [-32.16635513305664, 91.06437683105469],
  422: [-31.840103149414062, 91.20419311523438],
  423: [-31.513851165771484, 91.3440170288086],
  469: [-15.1948881149292, 91.3371353149414],
  470: [-14.868742942810059, 91.1973648071289],
  471: [-14.542601585388184, 91.05758666992188],
  472: [-14.216456413269043, 90.91781616210938],
  473: [-13.967143058776855, 90.71036529541016],
  474: [-13.869664192199707, 90.36917877197266],
  475: [-13.772183418273926, 90.02799224853516],
  476: [-13.674698829650879, 89.68680572509766],
  1069: [-31.590042114257812, -103.554931640625],
  1070: [-31.907413482666016, -103.39625549316406],
  1071: [-32.22478485107422, -103.23756408691406],
  1072: [-32.54215621948242, -103.07887268066406],
  1073: [-32.7216796875, -102.77439880371094],
  1074: [-32.89775085449219, -102.46626281738281],
  1075: [-33.07382583618164, -102.15814208984375],
  1016: [-13.679760932922363, -101.919677734375],
  1017: [-13.819535255432129, -102.24581909179688],
  1018: [-13.959305763244629, -102.57196044921875],
  1019: [-14.099089622497559, -102.89810180664062],
  1020: [-14.320136070251465, -103.14761352539062],
  1021: [-14.6375150680542, -103.30630493164062],
  1022: [-14.954894065856934, -103.46499633789062],
};
