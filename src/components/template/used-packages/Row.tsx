import React from "react";
interface IRow {
  packageName: string;
  children: React.ReactNode;
}
export default function Row({ children, packageName }: IRow) {
  return (
    <div className="even:text-success odd:text-warning">
      <div className="">
        <div className="text-start">
          <code>
            <span className="mx-2 text-sm animate-bounce  inline-block">$</span>
            <span className="text-white animate-pulse">npm i</span>
            <kbd className="text-wrap animate-bounce inline-block px-1.5 py-0.5 text-sm rounded-lg ms-1.5 bg-[#191e24]">
              {packageName}
            </kbd>
          </code>
        </div>
        <div
          className="text-end ps-2"
          style={{ direction: "rtl", textAlign: "right" }}
        >
          <code className="text-wrap ">{children}</code>
        </div>
      </div>

      <div className="divider"></div>
    </div>
  );
}
