import React from "react";
interface IRow {
  packageName: string;
  children: React.ReactNode;
}
export default function Row({ children, packageName }: IRow) {
  return (
    <div className="even:text-success odd:text-warning">
      <pre data-prefix="$">
        <div className="inline-flex flex-col lg:flex-row lg:items-center justify-between w-4/5 gap-y-2 lg:gap-0 lg:w-[95%]">
          <code className="text-wrap">
            <span className="text-white">npm i</span>{" "}
            <kbd className="kbd kbd-sm bg-[#191e24]">{packageName}</kbd>
          </code>
          <code
            className="text-wrap text-end lg:text-start"
            style={{ direction: "rtl", textAlign: "right" }}
          >
            {children}
          </code>
        </div>
      </pre>
      <div className="divider"></div>
    </div>
  );
}
