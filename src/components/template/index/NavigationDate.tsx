"use client";
import useDateStore from "@/stores/DateStore";
import useTheme from "@/stores/ThemeStore";
import { cn } from "cn-func";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DatePicker from "react-multi-date-picker";
import "react-multi-date-picker/styles/backgrounds/bg-dark.css";
import { useSwipeable } from "react-swipeable";

export default function NavigationDate() {
  const date = useDateStore((state) => state.date);
  const changeDate = useDateStore((state) => state.changeDate);
  const reload = useDateStore((state) => state.reload);
  const theme = useTheme((state) => state.theme);

  const handlers = useSwipeable({
    onSwipedLeft: () => changeDate(new Date(date.setDate(date.getDate() - 1))),
    onSwipedRight: () => changeDate(new Date(date.setDate(date.getDate() + 1))),
    trackMouse: true,
  });

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
    <section {...handlers} className="pb-2">
      <div>
        <button
          className="btn btn-primary btn-outline mb-8 ms-auto"
          onClick={() => changeDate(new Date())}
          disabled={date.toDateString() === new Date().toDateString()}
        >
          برگرد به امروز
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

        <DatePicker
          value={date}
          calendar={persian}
          locale={persian_fa}
          className={theme === "dark" ? "bg-dark" : ""}
          onChange={(e) => changeDate(e?.toDate() as Date)}
          render={
            <button className=" btn btn-primary btn-outline mb-4 ms-4">
              برو به تاریخ
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
                  />
                </svg>
              </div>
            </button>
          }
        >
          <button
            className="btn btn-primary btn-sm btn-outline mb-4 text-xs"
            onClick={() => changeDate(new Date())}
            disabled={date.toDateString() === new Date().toDateString()}
          >
            امروز
          </button>
        </DatePicker>
      </div>
      <div role="tablist" className="tabs tabs-boxed tabs-lg h-14 lg:h-16">
        {displayDates.map((d, index) => (
          <div
            key={index}
            className={cn(
              "dateBtn",
              d.toDateString() === date.toDateString()
                ? "activeDateBtn date_animation_up"
                : "deActiveDateBtn",
              d.toDateString() === date.toDateString() && reload
                ? "date_animation_up"
                : "date_animation_down"
            )}
            onClick={() => changeDate(d)}
          >
            {d.toLocaleDateString("fa-ir", { weekday: "long" })}
            <br />
            {d.toLocaleDateString("fa-ir")}
          </div>
        ))}
      </div>
    </section>
  );
}
