"use client";
import useDateStore from "@/stores/DateStore";

export default function NavigationDate() {
  const date = useDateStore((state) => state.date);
  const changeDate = useDateStore((state) => state.changeDate);

  // send to api 👇
  // console.log("split t", date.toISOString().split("T")[0]);

  // console.log("dateeeeeeeee", new Date(date.toISOString().split("T")[0]));

  // Get the dates to be displayed in the tab bar
  const getDisplayDates = (currentDate: Date) => {
    const dates = [];
    let count = 1;

    for (let i = -count; i <= count; i++) {
      const newDate = new Date(currentDate);

      newDate.setDate(currentDate.getDate() + i);
      dates.push(newDate);
    }

    return dates;
  };

  const displayDates = getDisplayDates(date);
  return (
    <>
      <button
        className="btn btn-sm btn-primary btn-outline mb-4 ml-auto"
        onClick={() => changeDate(new Date())}
        disabled={date.toDateString() === new Date().toDateString()}
      >
        today
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
          />
        </svg>
      </button>
      <div role="tablist" className="tabs tabs-boxed lg:tabs-lg transition-all">
        {displayDates.map((d, index) => (
          <div
            key={index}
            className={`tab transition-all lg:text-lg text-base ${
              d.toDateString() === date.toDateString()
                ? "tab-active lg:!text-xl !text-lg scale-110 !-translate-y-1 font-semibold btn-disabled"
                : "hover:btn-link"
            }`}
            onClick={() => changeDate(d)}
          >
            {d.toLocaleDateString("fa-ir")}
          </div>
        ))}
      </div>
    </>
  );
}
