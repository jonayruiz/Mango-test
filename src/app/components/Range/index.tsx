import RangeSimple from "@/app/components/Range/simple";
import RangeSteps from "@/app/components/Range/steps";
const Ranger = ({ type }: { type?: string }) => {
  if (type !== "steps" || !type) {
    return <RangeSimple />;
  } else {
    return <RangeSteps />;
  }
};

export default Ranger;
