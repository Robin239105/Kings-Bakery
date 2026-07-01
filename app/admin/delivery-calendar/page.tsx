"use client";

import React, { useState, useEffect } from "react";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Loader2, 
  X, 
  Lock, 
  Unlock,
  RefreshCw,
  Info
} from "lucide-react";
import Button from "@/components/ui/Button";

interface DeliverySlot {
  id?: string;
  date: string;
  isFullyBooked: boolean;
  capacity: number;
  bookedCount: number;
}

export default function AdminDeliveryCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [slots, setSlots] = useState<DeliverySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal / Editor State
  const [selectedSlot, setSelectedSlot] = useState<DeliverySlot | null>(null);
  const [editingCapacity, setEditingCapacity] = useState(20);
  const [editingFullyBooked, setEditingFullyBooked] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchSlots = async () => {
    setLoading(true);
    setError(null);
    try {
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const monthStr = `${year}-${month}`;

      const res = await fetch(`/api/delivery-slots?month=${monthStr}`);
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || "Failed to load calendar slots.");
      }

      setSlots(json.data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, [currentDate]);

  // Calendar Helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedSlot(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedSlot(null);
  };

  const getSlotForDay = (day: number) => {
    // dates are stored in DB as UTC midnight date strings.
    const queryDateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return slots.find(s => {
      const slotDateObj = new Date(s.date);
      const slotYear = slotDateObj.getUTCFullYear();
      const slotMonth = slotDateObj.getUTCMonth();
      const slotDay = slotDateObj.getUTCDate();
      return slotYear === year && slotMonth === month && slotDay === day;
    });
  };

  const handleDayClick = (day: number) => {
    const slot = getSlotForDay(day);
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    
    if (slot) {
      setSelectedSlot(slot);
      setEditingCapacity(slot.capacity);
      setEditingFullyBooked(slot.isFullyBooked);
    } else {
      setSelectedSlot({
        date: new Date(Date.UTC(year, month, day)).toISOString(),
        isFullyBooked: false,
        capacity: 20,
        bookedCount: 0,
      });
      setEditingCapacity(20);
      setEditingFullyBooked(false);
    }
  };

  const handleSaveSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;
    setSaving(true);

    try {
      const res = await fetch("/api/admin/delivery-slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: selectedSlot.date,
          isFullyBooked: editingFullyBooked,
          capacity: editingCapacity,
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        alert(json.error?.message || "Failed to update slot settings.");
      } else {
        // Refresh slots and clear selection modal
        setSelectedSlot(null);
        fetchSlots();
      }
    } catch (err) {
      console.error(err);
      alert("Network error saving slot.");
    } finally {
      setSaving(false);
    }
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="space-y-6 font-sans">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Delivery Slots Calendar</h2>
          <p className="text-sm text-slate-500">Track current bookings, set daily capacity, or block dates manually.</p>
        </div>
        <button
          onClick={fetchSlots}
          className="self-start sm:self-auto bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2 cursor-pointer transition-colors"
        >
          <RefreshCw size={14} />
          Refresh Calendar
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ── CALENDAR GRID ── */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm lg:col-span-2 space-y-4">
          
          {/* Month Navigator */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-base">
              {monthNames[month]} {year}
            </h3>
            <div className="flex gap-1">
              <button
                onClick={prevMonth}
                className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded transition-colors cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={nextMonth}
                className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded transition-colors cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center gap-2">
              <Loader2 size={24} className="animate-spin text-[#A77146]" />
              <p className="text-slate-400 text-xs font-semibold">Updating slot metrics...</p>
            </div>
          ) : error ? (
            <div className="h-64 flex items-center justify-center text-rose-500 font-semibold">{error}</div>
          ) : (
            <div className="space-y-4">
              
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 text-center font-bold text-[10px] text-slate-400 uppercase tracking-wider">
                <div>Sun</div>
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
              </div>

              {/* Day Cells Grid */}
              <div className="grid grid-cols-7 gap-2">
                {/* Empty cells before month start */}
                {Array.from({ length: firstDayIndex }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square bg-slate-50/50 rounded-lg" />
                ))}

                {/* Day cells */}
                {Array.from({ length: totalDays }).map((_, i) => {
                  const dayNum = i + 1;
                  const slot = getSlotForDay(dayNum);
                  const isBlocked = slot?.isFullyBooked || (slot && slot.bookedCount >= slot.capacity);
                  const booked = slot?.bookedCount ?? 0;
                  const cap = slot?.capacity ?? 20;

                  return (
                    <button
                      key={dayNum}
                      onClick={() => handleDayClick(dayNum)}
                      className={`
                        aspect-square p-2 border rounded-lg flex flex-col justify-between items-start text-left cursor-pointer transition-all hover:scale-[1.02]
                        ${isBlocked 
                          ? "bg-rose-50 border-rose-200 text-rose-800" 
                          : slot 
                          ? "bg-emerald-50/40 border-emerald-100 text-slate-800 hover:border-emerald-300"
                          : "bg-white border-slate-200 text-slate-800 hover:border-[#A77146]"
                        }
                      `}
                    >
                      <span className="font-bold text-xs">{dayNum}</span>
                      
                      <div className="w-full flex items-center justify-between text-[9px] font-semibold">
                        {isBlocked ? (
                          <span className="text-rose-600 flex items-center gap-0.5">
                            <Lock size={10} /> Fully Booked
                          </span>
                        ) : (
                          <span className="text-slate-400">
                            {booked}/{cap} orders
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

            </div>
          )}

        </div>

        {/* ── EDITOR BOX ── */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm space-y-4">
            
            <div className="border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <CalendarIcon className="text-[#A77146]" size={18} />
                Manage Day Settings
              </h3>
              <p className="text-xs text-slate-500">Select a calendar date to configure capacity.</p>
            </div>

            {!selectedSlot ? (
              <div className="py-12 text-center text-slate-400 flex flex-col items-center justify-center gap-2 bg-slate-50 border border-slate-150 border-dashed rounded-xl">
                <Info size={24} className="text-slate-300" />
                <p className="text-xs font-semibold">No Date Selected</p>
                <p className="text-[10px] text-slate-400">Click any date grid block on the calendar.</p>
              </div>
            ) : (
              <form onSubmit={handleSaveSlot} className="space-y-5 text-xs text-slate-600">
                
                {/* Date Display */}
                <div className="bg-slate-50 border border-slate-150 p-3 rounded-lg">
                  <p className="font-bold text-[9px] uppercase tracking-wide text-slate-400 mb-0.5">Target Date</p>
                  <p className="font-bold text-slate-800 text-sm">
                    {new Date(selectedSlot.date).toLocaleDateString(undefined, {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                      timeZone: "UTC"
                    })}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1 font-semibold">
                    Current Bookings: <span className="text-slate-700 font-bold">{selectedSlot.bookedCount}</span> orders
                  </p>
                </div>

                {/* Capacity Input */}
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Maximum Capacity limit</label>
                  <input
                    type="number"
                    min={selectedSlot.bookedCount}
                    value={editingCapacity}
                    onChange={(e) => setEditingCapacity(parseInt(e.target.value, 10))}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#A77146] focus:border-[#A77146]"
                  />
                  <p className="text-[9px] text-slate-400">Default capacity is 20 bookings per day.</p>
                </div>

                {/* Blocked Date Checkbox */}
                <div className="flex items-start gap-2.5 bg-slate-50 border border-slate-100 p-4 rounded-xl">
                  <input
                    type="checkbox"
                    id="formIsBlocked"
                    checked={editingFullyBooked}
                    onChange={(e) => setEditingFullyBooked(e.target.checked)}
                    className="w-4 h-4 text-rose-600 focus:ring-rose-500 border-slate-300 rounded cursor-pointer mt-0.5"
                  />
                  <div className="leading-relaxed">
                    <label htmlFor="formIsBlocked" className="font-bold text-slate-800 cursor-pointer block">
                      Block all new bookings
                    </label>
                    <span className="text-[10px] text-slate-400 font-medium leading-normal block mt-0.5">
                      Marking this as active instantly prevents customer checkouts on the storefront for this date.
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedSlot(null)}
                    className="w-full !py-2.5 text-xs font-semibold uppercase tracking-wider"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={saving}
                    variant="primary"
                    className="w-full !py-2.5 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {saving && <Loader2 size={13} className="animate-spin text-white" />}
                    Save Config
                  </Button>
                </div>

              </form>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}
