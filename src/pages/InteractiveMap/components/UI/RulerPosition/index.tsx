import { useMemo } from 'react';

import { useRecoilState } from 'recoil';

import useI18N from '@/i18n';
import langState from '@/store/lang';

import { calculateHypotenuse } from '@/pages/InteractiveMap/utils';

import './style.less';

interface RulerPositionProps {
  rulerPosition?: InteractiveMap.Position2D[];
  image2realPos?: InteractiveMap.ImageTransformProps;
}

const Index = (props: RulerPositionProps) => {
  const { rulerPosition, image2realPos } = props;

  const [lang] = useRecoilState(langState);
  const { t } = useI18N(lang);

  const length = useMemo(() => {
    if (rulerPosition && image2realPos) {
      const realPosition = rulerPosition.map((rp) => image2realPos.p(rp));
      return calculateHypotenuse(realPosition[0], realPosition[1]);
    } else {
      return 0;
    }
  }, [rulerPosition, image2realPos]);

  if (rulerPosition) {
    return (
      <div className="im-rulerposition">
        <span>{t('ruler.distance')} {length.toFixed(1)} m</span>
      </div>
    );
  } else {
    return null;
  }
};

export default Index;
