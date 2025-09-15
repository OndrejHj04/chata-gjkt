import dayjs from "dayjs";
import "dayjs/locale/cs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

const dayjsExtended = dayjs;
dayjs.locale("cs");
dayjs.extend(isSameOrBefore);

export default dayjsExtended;
