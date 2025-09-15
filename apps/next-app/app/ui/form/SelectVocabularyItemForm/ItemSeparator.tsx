import clsx from "clsx"

export default function ItemSeparator(props: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div {...props} className={clsx("h-0.25 w-[100%] bg-navylight-100", props.className)}></div>
  );
}
