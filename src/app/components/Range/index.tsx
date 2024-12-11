import RangeSimple from "@/app/exercise1/components/Range";
import RangeSteps from "@/app/exercise2/components/Range";
const Ranger = ({ type }: { type?: string }) => {
  if (type !== "steps" || !type) {
    return <RangeSimple />;
  } else {
    return <RangeSteps />;
  }
};

export default Ranger;
