"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from "lucide-react";

interface DeliveryCalendarProps {
  selectedDate: string;
  selectedTimeSlot: string;
  onSelectDate: (dateStr: string) => void;
  onSelectTimeSlot: (slot: string) => void;
}

export const DeliveryCalendar: React.FC<DeliveryCalendarProps> = ({
  selectedDate,
  selectedTimeSlot,
  onSelectDate,
  onSelectTimeSlot,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const timeSlots = ["10 AM - 1 PM (Morning Flight)", "1 PM - 4 PM (Midday Flight)", "4 PM - 7 PM (Evening Flight)"];

  // Helper to format Date objects as YYYY-MM-DD
  const formatDateStr = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  // Mock booked dates logic (e.g., today + 2 days, today + 5 days are fully booked)
  const today = new Date();
  const fullyBookedDates: string[] = [];
  
  const booked1 = new Date();
  booked1.setDate(today.getDate() + 2);
  fullyBookedDates.push(formatDateStr(booked1));

  const booked2 = new Date();
  booked2.setDate(today.getDate() + 5);
  fullyBookedDates.push(formatDateStr(booked2));

  // Calendar rendering calculations
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  // First day of month (0 = Sunday, 1 = Monday...)
  const firstDayIndex = new Date(year, month, 1).getDay();
  // Total days in month
  const totalDays = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handlePrevMonth = () => {
    const prev = new Date(year, month - 1, 1);
    // Don't navigate before current month
    if (prev.getMonth() >= today.getMonth() || prev.getFullYear() > today.getFullYear()) {
      setCurrentMonth(prev);
    }
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const daysGrid: (Date | null)[] = [];
  for (let i = 0; i < firstDayIndex; i++) {
    daysGrid.push(null);
  }
  for (let i = 1; i <= totalDays; i++) {
    daysGrid.push(new Date(year, month, i));
  }

  return (
    <div className="space-y-6">
      {/* 1. Date Calendar Widget */}
      <div className="bg-white border border-gold-light/25 p-5 rounded-[8px] shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-serif font-bold text-base text-text-dark flex items-center gap-2">
            <CalendarIcon size={16} className="text-gold" /> Select Delivery Date
          </h3>
          
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              disabled={year === today.getFullYear() && month === today.getMonth()}
              className="p-1 hover:bg-gold-light/20 text-text-muted hover:text-text-dark rounded transition-colors disabled:opacity-30 cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-xs uppercase tracking-wider font-semibold text-text-dark w-24 text-center">
              {monthNames[month]} {year}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 hover:bg-gold-light/20 text-text-muted hover:text-text-dark rounded transition-colors cursor-pointer"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Days of week */}
        <div className="grid grid-cols-7 gap-1 text-center text-[10px] uppercase tracking-wider font-semibold text-text-muted mb-2 font-sans">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {daysGrid.map((date, idx) => {
            if (!date) return <div key={`empty-${idx}`} />;
            
            const dateStr = formatDateStr(date);
            const isSelected = selectedDate === dateStr;
            const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const isFullyBooked = fullyBookedDates.includes(dateStr);
            const isDisabled = isPast || isFullyBooked;

            return (
              <button
                key={dateStr}
                type="button"
                disabled={isDisabled}
                onClick={() => onSelectDate(dateStr)}
                className={`relative aspect-square text-xs font-sans rounded-[4px] transition-all flex flex-col items-center justify-center cursor-pointer ${
                  isSelected
                    ? "bg-gold text-white font-semibold shadow-sm"
                    : isFullyBooked
                    ? "bg-berry-accent/10 text-berry-accent border border-berry-accent/20 cursor-not-allowed line-through"
                    : isPast
                    ? "text-text-muted/30 cursor-not-allowed"
                    : "bg-bg-cream/40 text-text-dark hover:border-gold border border-gold-light/20"
                }`}
                title={
                  isFullyBooked
                    ? "Fully Booked"
                    : isPast
                    ? "Past Date"
                    : `Select ${dateStr}`
                }
              >
                <span>{date.getDate()}</span>
                {isFullyBooked && (
                  <span className="absolute bottom-1 text-[7px] text-berry-accent font-semibold tracking-tighter scale-90 uppercase">
                    Full
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Calendar Legend */}
        <div className="mt-4 flex gap-4 text-[10px] uppercase tracking-wider text-text-muted justify-center border-t border-gold/10 pt-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 bg-gold rounded-[2px]" />
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 bg-white border border-gold-light/20 rounded-[2px]" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 bg-berry-accent/15 border border-berry-accent/20 rounded-[2px]" />
            <span className="text-berry-accent">Fully Booked</span>
          </div>
        </div>
      </div>

      {/* 2. Time Window Selector */}
      {selectedDate && (
        <div className="bg-white border border-gold-light/25 p-5 rounded-[8px] shadow-sm space-y-4">
          <h3 className="text-serif font-bold text-base text-text-dark flex items-center gap-2">
            <Clock size={16} className="text-gold" /> Select Time Slot
          </h3>
          <div className="grid grid-cols-1 gap-2.5">
            {timeSlots.map((slot) => (
              <label
                key={slot}
                onClick={() => onSelectTimeSlot(slot)}
                className={`flex items-center gap-3 p-3.5 border rounded-[4px] text-xs md:text-sm cursor-pointer transition-colors ${
                  selectedTimeSlot === slot
                    ? "bg-gold-light/20 border-gold text-gold font-semibold"
                    : "bg-bg-cream/30 border-gold-light/25 hover:border-gold/30 text-text-muted"
                }`}
              >
                <input
                  type="radio"
                  name="timeSlot"
                  checked={selectedTimeSlot === slot}
                  onChange={() => {}}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  selectedTimeSlot === slot ? "border-gold" : "border-gold-light"
                }`}>
                  {selectedTimeSlot === slot && <div className="w-2 h-2 bg-gold rounded-full" />}
                </div>
                <span>{slot}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryCalendar;
