import { Calendar, Users, Clock } from 'lucide-react';

const scheduleData = [
  { day: 'Monday', hours: '9am-7pm', staff: 8, collecting: 2, scanning: 3, cashiers: 2, stocking: 1 },
  { day: 'Tuesday', hours: '9am-7pm', staff: 8, collecting: 2, scanning: 3, cashiers: 2, stocking: 1 },
  { day: 'Wednesday', hours: '9am-7pm', staff: 7, collecting: 2, scanning: 2, cashiers: 2, stocking: 1 },
  { day: 'Thursday', hours: '9am-7pm', staff: 8, collecting: 2, scanning: 3, cashiers: 2, stocking: 1 },
  { day: 'Friday', hours: '9am-7pm', staff: 9, collecting: 3, scanning: 3, cashiers: 2, stocking: 1 },
  { day: 'Saturday', hours: '9am-7pm', staff: 10, collecting: 3, scanning: 4, cashiers: 2, stocking: 1 },
  { day: 'Sunday', hours: '10am-6pm', staff: 6, collecting: 2, scanning: 2, cashiers: 1, stocking: 1 },
];

export function WorkSchedule() {
  const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
  const todaySchedule = scheduleData[today === 0 ? 6 : today - 1];

  return (
    <div className="p-3 pb-6 space-y-3">
      {/* Today's Schedule */}
      <div className="bg-[#0053A0] text-white rounded-lg shadow-md p-4">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-5 h-5" />
          <div>
            <h3 className="text-white text-base font-bold">Today: {todaySchedule.day}</h3>
            <p className="text-xs text-white">Store Hours: {todaySchedule.hours}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-white/20 rounded p-2">
            <Users className="w-4 h-4 mb-1" />
            <p className="font-bold">{todaySchedule.staff} Staff</p>
          </div>
          <div className="bg-white/20 rounded p-2">
            <Clock className="w-4 h-4 mb-1" />
            <p className="font-bold">{todaySchedule.hours}</p>
          </div>
        </div>
      </div>

      {/* Shift Breakdown */}
      <div className="bg-white rounded-lg shadow-md border border-[#99c2e6] p-3">
        <h4 className="text-sm font-bold mb-2">Today's Shifts</h4>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">📦 Collecting items</span>
            <span className="font-bold text-[#0053A0]">{todaySchedule.collecting}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700">🔍 Scanning & categorizing</span>
            <span className="font-bold text-[#0053A0]">{todaySchedule.scanning}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700">💵 Cashiers</span>
            <span className="font-bold text-[#0053A0]">{todaySchedule.cashiers}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-700">📚 Stocking shelves</span>
            <span className="font-bold text-[#0053A0]">{todaySchedule.stocking}</span>
          </div>
        </div>
      </div>

      {/* Weekly Schedule */}
      <div className="bg-white rounded-lg shadow-md border border-[#99c2e6] p-3">
        <h4 className="text-sm font-bold mb-2">Weekly Schedule</h4>
        <div className="space-y-1">
          {scheduleData.map((day, idx) => (
            <div
              key={day.day}
              className={`flex justify-between items-center p-2 rounded ${
                idx === (today === 0 ? 6 : today - 1) ? 'bg-[#e6f0f9] border border-[#66a3d9]' : ''
              }`}
            >
              <div className="text-xs">
                <p className="font-bold text-gray-900">{day.day}</p>
                <p className="text-gray-600">{day.hours}</p>
              </div>
              <div className="text-right text-xs">
                <p className="font-bold text-[#0053A0]">{day.staff} staff</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
