import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../common/Navbar.jsx';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Search,
  Settings,
  HelpCircle,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  X,
  Check,
  CheckCheck,
  Trash2,
  Edit2,
  ArrowRight,
  Layers,
  Sparkles,
  Menu,
  SlidersHorizontal,
  Share2,
  Send,
  Copy,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import './style/CalendarViewPage.css';

// Initial Mock Events matching Image 2 perfectly + Trip Mate events
const INITIAL_EVENTS = [
  {
    id: 'ev-1',
    title: 'make the calender feat...',
    fullTitle: 'Make the calendar feature responsive & interactive',
    dayIndex: 3, // Wed 8 (0: Sun, 1: Mon, 2: Tue, 3: Wed, 4: Thu, 5: Fri, 6: Sat)
    date: '2026-07-08',
    startTime: '14:00',
    endTime: '15:00',
    timeDisplay: '02:00 PM - 03:00 PM',
    color: '#0284c7', // Sky Blue
    category: 'Development',
    description: 'Build Google Calendar dark theme weekly time grid and mini calendar.'
  },
  {
    id: 'ev-2',
    title: 'make the live employe...',
    fullTitle: 'Make the live employee and tripmate collaboration hub',
    dayIndex: 3, // Wed 8
    date: '2026-07-08',
    startTime: '15:00',
    endTime: '16:00',
    timeDisplay: '03:00 PM - 04:00 PM',
    color: '#9333ea', // Purple
    category: 'Management',
    description: 'Sync live itinerary updates and real-time trip invitations.'
  },
  {
    id: 'ev-3',
    title: 'made better ui',
    fullTitle: 'Made better UI & professional dark monochrome themes',
    dayIndex: 3, // Wed 8
    date: '2026-07-08',
    startTime: '16:00',
    endTime: '17:00',
    timeDisplay: '04:00 PM - 05:00 PM',
    color: '#f59e0b', // Yellow / Amber
    category: 'Design',
    description: 'Refine fonts, micro-interactions, sleek scrollbars and responsive cards.'
  },
  {
    id: 'ev-4',
    title: 'make the deal',
    fullTitle: 'Make the deal with partner hotels & flight APIs',
    dayIndex: 4, // Thu 9
    date: '2026-07-09',
    startTime: '14:00',
    endTime: '15:00',
    timeDisplay: '02:00 PM - 03:00 PM',
    color: '#10b981', // Mint Green
    category: 'Business',
    description: 'Finalize partner agreements for zero-commission travel bookings.'
  },
  {
    id: 'ev-5',
    title: 'meeting 1',
    fullTitle: 'Meeting 1: Globetrotter Sprint Review',
    dayIndex: 5, // Fri 10
    date: '2026-07-10',
    startTime: '14:00',
    endTime: '15:00',
    timeDisplay: '02:00 PM - 03:00 PM',
    color: '#06b6d4', // Cyan
    category: 'Meeting',
    description: 'Team review of the interactive trip maps and budget calculations.'
  },
  {
    id: 'ev-6',
    title: 'improve the p...',
    fullTitle: 'Improve the performance and mobile layout transitions',
    dayIndex: 6, // Sat 11
    date: '2026-07-11',
    startTime: '16:00',
    endTime: '17:00',
    timeDisplay: '04:00 PM - 05:00 PM',
    color: '#c026d3', // Magenta Purple
    category: 'Performance',
    description: 'Audit Lighthouse score and verify mobile drawer animations.'
  },
  {
    id: 'ev-7',
    title: 'Paris Trip: Flight Departure',
    fullTitle: 'Paris Trip: Flight Departure & Airport Check-in',
    dayIndex: 1, // Mon 6
    date: '2026-07-06',
    startTime: '10:00',
    endTime: '12:00',
    timeDisplay: '10:00 AM - 12:00 PM',
    color: '#6366f1', // Indigo
    category: 'Travel',
    description: 'Terminal 3 departure to Paris Charles de Gaulle.'
  }
];

// Hours to display in the weekly time grid (9 AM to 11 PM)
const TIME_SLOTS = [
  { hour: 9, label: '9 AM', time24: '09:00' },
  { hour: 10, label: '10 AM', time24: '10:00' },
  { hour: 11, label: '11 AM', time24: '11:00' },
  { hour: 12, label: '12 PM', time24: '12:00' },
  { hour: 13, label: '1 PM', time24: '13:00' },
  { hour: 14, label: '2 PM', time24: '14:00' },
  { hour: 15, label: '3 PM', time24: '15:00' },
  { hour: 16, label: '4 PM', time24: '16:00' },
  { hour: 17, label: '5 PM', time24: '17:00' },
  { hour: 18, label: '6 PM', time24: '18:00' },
  { hour: 19, label: '7 PM', time24: '19:00' },
  { hour: 20, label: '8 PM', time24: '20:00' },
  { hour: 21, label: '9 PM', time24: '21:00' },
  { hour: 22, label: '10 PM', time24: '22:00' },
  { hour: 23, label: '11 PM', time24: '23:00' }
];

// Week days definition matching July 5 - July 11, 2026 (Image 2)
const WEEK_DAYS = [
  { name: 'SUN', dateNum: 5, dateStr: '2026-07-05', isToday: false },
  { name: 'MON', dateNum: 6, dateStr: '2026-07-06', isToday: false },
  { name: 'TUE', dateNum: 7, dateStr: '2026-07-07', isToday: false },
  { name: 'WED', dateNum: 8, dateStr: '2026-07-08', isToday: false },
  { name: 'THU', dateNum: 9, dateStr: '2026-07-09', isToday: false },
  { name: 'FRI', dateNum: 10, dateStr: '2026-07-10', isToday: true },
  { name: 'SAT', dateNum: 11, dateStr: '2026-07-11', isToday: false }
];

const MINI_CAL_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Helper to generate full month grid (35 or 42 cells)
const generateMonthCells = (year, month) => {
  const firstDay = new Date(year, month, 1).getDay(); // 0 (Sun) to 6 (Sat)
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells = [];
  // Previous month trailing days
  for (let i = firstDay - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const prevM = month === 0 ? 11 : month - 1;
    const prevY = month === 0 ? year - 1 : year;
    cells.push({
      dayNum: day,
      inCurrentMonth: false,
      dateStr: `${prevY}-${String(prevM + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({
      dayNum: d,
      inCurrentMonth: true,
      isToday: year === 2026 && month === 6 && d === 10,
      isHighlight: d === 10,
      isCircle: d === 31,
      dateStr: `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    });
  }

  // Next month leading days to complete full rows (multiple of 7)
  const targetTotal = cells.length > 35 ? 42 : 35;
  const remaining = targetTotal - cells.length;
  for (let d = 1; d <= remaining; d++) {
    const nextM = month === 11 ? 0 : month + 1;
    const nextY = month === 11 ? year + 1 : year;
    cells.push({
      dayNum: d,
      inCurrentMonth: false,
      dateStr: `${nextY}-${String(nextM + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    });
  }

  return cells;
};

const CalendarViewPage = () => {
  const navigate = useNavigate();

  // Active View & Date Navigation State
  const [viewMode, setViewMode] = useState('Month'); // 'Week', 'Day', 'Month', 'Schedule'
  const [showViewDropdown, setShowViewDropdown] = useState(false);
  const [miniCalMonth, setMiniCalMonth] = useState(6); // 0-indexed (6 = July)
  const [miniCalYear, setMiniCalYear] = useState(2026);
  const [selectedMiniDay, setSelectedMiniDay] = useState(10);
  
  // Mobile Drawer State
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Events State
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Accordion State
  const [myCalendarsOpen, setMyCalendarsOpen] = useState(true);
  const [otherCalendarsOpen, setOtherCalendarsOpen] = useState(true);

  // Calendar Checkbox Filters
  const [calFilterAdmin, setCalFilterAdmin] = useState(true);
  const [calFilterHolidays, setCalFilterHolidays] = useState(true);

  // Share Plan to Friend State
  const [showShareModal, setShowShareModal] = useState(false);
  const [friendEmail, setFriendEmail] = useState('');
  const [friendRole, setFriendRole] = useState('Can edit');
  const [shareMessage, setShareMessage] = useState('Check out our upcoming trip itinerary and calendar schedule!');
  const [invitedFriends, setInvitedFriends] = useState(['alex.morgan@gmail.com', 'sarah.travel@gmail.com']);
  const [copiedLink, setCopiedLink] = useState(false);
  const [sendSuccessToast, setSendSuccessToast] = useState('');

  // Create Event Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: '',
    dayIndex: 3,
    date: '2026-07-10',
    startTime: '14:00',
    endTime: '15:00',
    color: '#0284c7',
    category: 'Trip Activity',
    description: ''
  });

  // Dynamic Month Cells
  const monthCells = generateMonthCells(miniCalYear, miniCalMonth);

  // Current display header title
  const currentDisplayTitle = `${MINI_CAL_MONTHS[miniCalMonth]} ${miniCalYear}`;

  const handlePrev = () => {
    if (miniCalMonth === 0) {
      setMiniCalMonth(11);
      setMiniCalYear(miniCalYear - 1);
    } else {
      setMiniCalMonth(miniCalMonth - 1);
    }
  };

  const handleNext = () => {
    if (miniCalMonth === 11) {
      setMiniCalMonth(0);
      setMiniCalYear(miniCalYear + 1);
    } else {
      setMiniCalMonth(miniCalMonth + 1);
    }
  };

  const handleToday = () => {
    setMiniCalMonth(6);
    setMiniCalYear(2026);
    setSelectedMiniDay(10);
  };

  // Open creation modal for a specific day and hour slot
  const handleCellClick = (dayIdx, hour) => {
    const formattedStart = `${hour < 10 ? '0' : ''}${hour}:00`;
    const formattedEnd = `${hour + 1 < 10 ? '0' : ''}${hour + 1}:00`;

    setCreateForm({
      title: '',
      dayIndex: dayIdx,
      date: WEEK_DAYS[dayIdx]?.dateStr || '2026-07-10',
      startTime: formattedStart,
      endTime: formattedEnd,
      color: '#0284c7',
      category: 'Trip Activity',
      description: ''
    });
    setShowCreateModal(true);
  };

  const handleMonthCellClick = (dateStr) => {
    setCreateForm({
      title: '',
      dayIndex: 3,
      date: dateStr,
      startTime: '10:00',
      endTime: '11:00',
      color: '#0284c7',
      category: 'Trip Activity',
      description: ''
    });
    setShowCreateModal(true);
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!createForm.title.trim()) return;

    const startH = parseInt(createForm.startTime.split(':')[0]);
    const startM = createForm.startTime.split(':')[1] || '00';
    const endH = parseInt(createForm.endTime.split(':')[0]);
    const endM = createForm.endTime.split(':')[1] || '00';

    const formatTime12 = (h, m) => {
      const period = h >= 12 ? 'PM' : 'AM';
      const adjH = h % 12 === 0 ? 12 : h % 12;
      return `${adjH < 10 ? '0' : ''}${adjH}:${m} ${period}`;
    };

    const newEvent = {
      id: `ev-${Date.now()}`,
      title: createForm.title.length > 22 ? `${createForm.title.slice(0, 22)}...` : createForm.title,
      fullTitle: createForm.title,
      dayIndex: parseInt(createForm.dayIndex),
      date: createForm.date || '2026-07-10',
      startTime: createForm.startTime,
      endTime: createForm.endTime,
      timeDisplay: `${formatTime12(startH, startM)} - ${formatTime12(endH, endM)}`,
      color: createForm.color,
      category: createForm.category,
      description: createForm.description || 'Scheduled via Globetrotter Calendar'
    };

    setEvents([...events, newEvent]);
    setShowCreateModal(false);
  };

  const handleDeleteEvent = (id) => {
    setEvents(events.filter((ev) => ev.id !== id));
    setSelectedEvent(null);
  };

  // Helper to find events for weekly time slot
  const getEventsForSlot = (dayIdx, hour) => {
    return events.filter((ev) => {
      if (ev.dayIndex !== dayIdx) return false;
      const startH = parseInt(ev.startTime.split(':')[0]);
      return startH === hour;
    });
  };

  // Helper to find events for specific date string in month grid
  const getEventsForDate = (dateStr) => {
    return events.filter((ev) => ev.date === dateStr);
  };

  // Copy shareable link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Send plan to friend via Email
  const handleSendFriendInvite = (e) => {
    e.preventDefault();
    if (!friendEmail.trim()) return;
    setInvitedFriends([...invitedFriends, friendEmail.trim()]);
    setSendSuccessToast(`Trip plan & calendar successfully sent to ${friendEmail.trim()}!`);
    setFriendEmail('');
    setTimeout(() => setSendSuccessToast(''), 4000);
  };

  // WhatsApp share
  const handleWhatsAppShare = () => {
    const summaryText = `*TripMate Calendar & Travel Plan* ✈️\n📅 Month: ${currentDisplayTitle}\n✨ Events & Activities: ${events.length} planned\n🔗 View our live itinerary: ${window.location.href}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(summaryText)}`, '_blank');
  };

  return (
    <div className="google-calendar-root-container">
      {/* Top Shared Navbar */}
      <Navbar />

      {/* =========================================================================
          GOOGLE CALENDAR APP HEADER (Matching Image 2 + Responsive)
          ========================================================================= */}
      <header className="gcal-header-bar">
        {/* Left: Hamburger (Mobile) + 31 Icon & Calendar Title */}
        <div className="gcal-header-left">
          <button 
            type="button" 
            className="gcal-sidebar-toggle-btn"
            onClick={() => setMobileDrawerOpen(true)}
            title="Open Mini Calendar & Filters"
          >
            <Menu size={20} />
          </button>

          <div className="gcal-brand-icon-box">
            <span className="gcal-icon-num">31</span>
          </div>
          <span className="gcal-title-text">Calendar</span>

          {/* Today Button */}
          <button 
            type="button" 
            className="gcal-today-pill-btn"
            onClick={handleToday}
          >
            Today
          </button>

          {/* Navigation Arrows */}
          <div className="gcal-nav-arrows-group">
            <button type="button" className="gcal-arrow-btn" onClick={handlePrev} title="Previous">
              <ChevronLeft size={18} />
            </button>
            <button type="button" className="gcal-arrow-btn" onClick={handleNext} title="Next">
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Month / Year Heading */}
          <h2 className="gcal-current-month-heading">{currentDisplayTitle}</h2>
        </div>

        {/* Right: Search, Settings, Share Plan to Friend, View Dropdown & Profile */}
        <div className="gcal-header-right">
          
          {/* SEND / SHARE PLAN TO FRIEND BUTTON */}
          <button 
            type="button" 
            className="gcal-share-plan-btn"
            onClick={() => setShowShareModal(true)}
            title="Send trip plan to friends"
          >
            <Share2 size={15} />
            <span>Send to Friend</span>
          </button>

          <button type="button" className="gcal-icon-action-btn desktop-only" title="Search">
            <Search size={18} />
          </button>
          <button type="button" className="gcal-icon-action-btn desktop-only" title="Support">
            <HelpCircle size={18} />
          </button>
          <button type="button" className="gcal-icon-action-btn desktop-only" title="Settings">
            <Settings size={18} />
          </button>

          {/* View Mode Selector Dropdown */}
          <div className="gcal-view-dropdown-container">
            <button 
              type="button" 
              className="gcal-view-selector-btn"
              onClick={() => setShowViewDropdown(!showViewDropdown)}
            >
              <span>{viewMode}</span>
              <ChevronDown size={14} />
            </button>

            {showViewDropdown && (
              <div className="gcal-view-menu">
                {['Month', 'Week', 'Day', 'Schedule'].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    className={`gcal-view-menu-item ${viewMode === mode ? 'active' : ''}`}
                    onClick={() => {
                      setViewMode(mode);
                      setShowViewDropdown(false);
                    }}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Toast Notification */}
      {sendSuccessToast && (
        <div className="gcal-toast-alert">
          <CheckCheck size={18} color="#22c55e" />
          <span>{sendSuccessToast}</span>
        </div>
      )}

      {/* =========================================================================
          CALENDAR BODY: LEFT SIDEBAR + MAIN TIME-GRID
          ========================================================================= */}
      <div className="gcal-workspace-body">
        
        {/* A. LEFT SIDEBAR (Desktop) */}
        <aside className="gcal-left-sidebar custom-scroll">
          
          {/* + Create Floating Pill Button */}
          <button 
            type="button" 
            className="gcal-create-pill-btn"
            onClick={() => {
              setCreateForm({
                title: '',
                dayIndex: 3,
                date: '2026-07-10',
                startTime: '14:00',
                endTime: '15:00',
                color: '#0284c7',
                category: 'Trip Activity',
                description: ''
              });
              setShowCreateModal(true);
            }}
          >
            <Plus size={20} className="create-plus-icon" />
            <span>Create</span>
          </button>

          {/* Mini Month Calendar */}
          <div className="gcal-mini-calendar-widget">
            <div className="mini-cal-header-row">
              <span className="mini-cal-month-title">{MINI_CAL_MONTHS[miniCalMonth]} {miniCalYear}</span>
              <div className="mini-cal-arrows">
                <button type="button" className="mini-arrow" onClick={handlePrev} title="Prev Month"><ChevronLeft size={14} /></button>
                <button type="button" className="mini-arrow" onClick={handleNext} title="Next Month"><ChevronRight size={14} /></button>
              </div>
            </div>

            {/* S M T W T F S Weekdays */}
            <div className="mini-cal-weekdays">
              <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
            </div>

            {/* Mini Days Grid */}
            <div className="mini-cal-days-grid">
              {monthCells.map((d, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`mini-day-cell ${!d.inCurrentMonth ? 'dimmed' : ''} ${d.isHighlight ? 'active-highlight' : ''} ${d.isCircle ? 'circle-selected' : ''}`}
                  onClick={() => setSelectedMiniDay(d.dayNum)}
                >
                  {d.dayNum}
                </button>
              ))}
            </div>
          </div>

          {/* Collapsible Accordion 1: My Calendars */}
          <div className="gcal-sidebar-accordion">
            <div 
              className="accordion-header-row" 
              onClick={() => setMyCalendarsOpen(!myCalendarsOpen)}
            >
              <span className="accordion-label">My calendars</span>
              {myCalendarsOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </div>

            {myCalendarsOpen && (
              <div className="accordion-content-list">
                <label className="gcal-checkbox-row">
                  <input 
                    type="checkbox" 
                    checked={calFilterAdmin}
                    onChange={(e) => setCalFilterAdmin(e.target.checked)}
                    className="custom-gcal-checkbox blue-chk"
                  />
                  <span className="chk-label">System Administrator</span>
                </label>
              </div>
            )}
          </div>

          {/* Collapsible Accordion 2: Other Calendars */}
          <div className="gcal-sidebar-accordion">
            <div 
              className="accordion-header-row" 
              onClick={() => setOtherCalendarsOpen(!otherCalendarsOpen)}
            >
              <span className="accordion-label">Other calendars</span>
              {otherCalendarsOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </div>

            {otherCalendarsOpen && (
              <div className="accordion-content-list">
                <label className="gcal-checkbox-row">
                  <input 
                    type="checkbox" 
                    checked={calFilterHolidays}
                    onChange={(e) => setCalFilterHolidays(e.target.checked)}
                    className="custom-gcal-checkbox purple-chk"
                  />
                  <span className="chk-label">Holidays in India</span>
                </label>
              </div>
            )}
          </div>

        </aside>

        {/* B. MAIN TIME GRID WITH HORIZONTAL & VERTICAL RESPONSIVENESS */}
        <main className="gcal-main-grid-area custom-scroll">
          
          {viewMode === 'Month' ? (
            /* TRUE 7-COLUMN MONTH GRID */
            <div className="gcal-month-board-view">
              
              {/* 7 Column Headers */}
              <div className="month-grid-header">
                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((d) => (
                  <div key={d} className="month-header-col">{d}</div>
                ))}
              </div>

              {/* 35/42 Grid Cells */}
              <div className="month-grid-cells-container">
                {monthCells.map((d, i) => {
                  const dayEvents = getEventsForDate(d.dateStr);
                  return (
                    <div 
                      key={i} 
                      className={`month-full-cell ${!d.inCurrentMonth ? 'outside' : ''}`}
                      onClick={() => handleMonthCellClick(d.dateStr)}
                      title="Click to add event"
                    >
                      <div className="month-cell-top-row">
                        <span className={`month-date-num ${d.isToday ? 'is-today' : ''}`}>
                          {d.dayNum}
                        </span>
                      </div>

                      {/* Event Chips List */}
                      <div className="month-events-wrapper">
                        {dayEvents.map((ev) => (
                          <div 
                            key={ev.id} 
                            className="month-event-chip"
                            style={{ backgroundColor: ev.color }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEvent(ev);
                            }}
                            title={`${ev.fullTitle} (${ev.timeDisplay})`}
                          >
                            <span className="chip-time">{ev.startTime}</span>
                            <span className="chip-text">{ev.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : viewMode === 'Week' ? (
            <div className="gcal-weekly-board">
              
              {/* Top Sticky Header: 7 Day Columns */}
              <div className="gcal-top-days-header-row">
                <div className="gcal-time-corner-gutter">
                  <span className="gmt-label">GMT+05:30</span>
                </div>

                {WEEK_DAYS.map((day, idx) => (
                  <div key={idx} className={`gcal-day-col-header ${day.isToday ? 'is-today' : ''}`}>
                    <span className="day-name-small">{day.name}</span>
                    <span className={`day-number-large ${day.isToday ? 'today-pill' : ''}`}>
                      {day.dateNum}
                    </span>
                  </div>
                ))}
              </div>

              {/* All-Day Bar row */}
              <div className="gcal-all-day-row">
                <div className="time-col-gutter"></div>
                {WEEK_DAYS.map((_, i) => (
                  <div key={i} className="all-day-cell"></div>
                ))}
              </div>

              {/* Time Slots Grid Rows (9 AM - 11 PM) */}
              <div className="gcal-time-slots-container">
                {TIME_SLOTS.map((slot) => (
                  <div key={slot.hour} className="gcal-hour-row">
                    {/* Time Label on Left */}
                    <div className="time-col-gutter">
                      <span className="hour-label-text">{slot.label}</span>
                    </div>

                    {/* 7 Days Columns for this hour */}
                    {WEEK_DAYS.map((day, dayIdx) => {
                      const slotEvents = getEventsForSlot(dayIdx, slot.hour);
                      return (
                        <div 
                          key={dayIdx} 
                          className="gcal-grid-slot-cell"
                          onClick={() => handleCellClick(dayIdx, slot.hour)}
                        >
                          {slotEvents.map((ev) => (
                            <div
                              key={ev.id}
                              className="gcal-scheduled-event-card"
                              style={{ backgroundColor: ev.color }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedEvent(ev);
                              }}
                              title={`${ev.fullTitle} (${ev.timeDisplay})`}
                            >
                              <span className="event-card-title">{ev.title}</span>
                              <span className="event-card-time">{ev.timeDisplay}</span>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

            </div>
          ) : viewMode === 'Day' ? (
            /* Professional Full-Width Day View Timeline */
            <div className="gcal-day-board-view">
              
              {/* Day Header */}
              <div className="day-view-top-header">
                <div className="day-time-col-gutter">
                  <span className="gmt-label">GMT+05:30</span>
                </div>
                <div className="day-header-day-col">
                  <span className="day-header-name">Friday</span>
                  <div className="day-header-pill">10</div>
                </div>
              </div>

              {/* All-Day Bar */}
              <div className="day-all-day-row">
                <div className="day-time-col-gutter"></div>
                <div className="day-all-day-cell"></div>
              </div>

              {/* Hourly Slots Timeline (9 AM - 11 PM) */}
              <div className="day-time-slots-container">
                {TIME_SLOTS.map((slot) => {
                  const dayEvents = getEventsForSlot(5, slot.hour);
                  return (
                    <div 
                      key={slot.hour} 
                      className="day-hour-slot-row"
                      onClick={() => handleCellClick(5, slot.hour)}
                    >
                      <div className="day-time-col-gutter">
                        <span className="hour-label-text">{slot.label}</span>
                      </div>
                      <div className="day-slot-grid-cell">
                        {dayEvents.map((ev) => (
                          <div 
                            key={ev.id} 
                            className="gcal-day-event-card"
                            style={{ backgroundColor: ev.color }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEvent(ev);
                            }}
                            title={`${ev.fullTitle} (${ev.timeDisplay})`}
                          >
                            <div className="day-event-header-row">
                              <span className="day-event-title">{ev.fullTitle}</span>
                              <span className="day-event-cat-badge">{ev.category}</span>
                            </div>
                            <span className="day-event-time">{ev.timeDisplay}</span>
                            {ev.description && <p className="day-event-desc">{ev.description}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          ) : (
            /* Schedule View */
            <div className="gcal-schedule-board-view">
              <div className="schedule-view-header">
                <h3>Upcoming Itinerary & Calendar Schedule</h3>
                <p>Overview of all planned events, flights, meetings, and activities</p>
              </div>
              <div className="schedule-events-list">
                {events.map((ev) => (
                  <div 
                    key={ev.id} 
                    className="schedule-event-row"
                    onClick={() => setSelectedEvent(ev)}
                  >
                    <div className="schedule-event-color-bar" style={{ backgroundColor: ev.color }} />
                    <div className="schedule-event-date-box">
                      <span className="date-main">{ev.date}</span>
                      <span className="time-sub">{ev.timeDisplay}</span>
                    </div>
                    <div className="schedule-event-info">
                      <h4 className="schedule-title">{ev.fullTitle}</h4>
                      <p className="schedule-desc">{ev.description}</p>
                    </div>
                    <span className="schedule-tag" style={{ borderColor: ev.color, color: ev.color }}>
                      {ev.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>

      </div>

      {/* =========================================================================
          MODAL: SEND PLAN TO FRIEND (Collaborative Sharing Hub)
          ========================================================================= */}
      {showShareModal && (
        <div className="modal-backdrop" onClick={() => setShowShareModal(false)}>
          <div className="gcal-share-modal" onClick={(e) => e.stopPropagation()}>
            <div className="share-modal-header">
              <div className="header-title-row">
                <Send size={20} color="#38bdf8" />
                <h3>Send Plan to Friends & Tripmates</h3>
              </div>
              <button 
                type="button" 
                className="close-share-btn" 
                onClick={() => setShowShareModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <p className="share-modal-subtitle">
              Invite friends to collaborate in real-time, view schedule dates, or send the complete itinerary via WhatsApp & Email.
            </p>

            {/* Plan Snapshot Card */}
            <div className="plan-summary-preview-card">
              <div className="plan-badge">✈️ ACTIVE ITINERARY</div>
              <h4>TripMate Travel & Calendar Schedule</h4>
              <div className="plan-meta-row">
                <span>📅 Month: {currentDisplayTitle}</span>
                <span>📌 {events.length} Activities & Stays</span>
                <span>👥 {invitedFriends.length + 1} Tripmates</span>
              </div>
            </div>

            {/* Share Method 1: Direct Email Invite */}
            <form onSubmit={handleSendFriendInvite} className="share-email-form">
              <label>Send via Email</label>
              <div className="email-input-group">
                <input 
                  type="email" 
                  placeholder="Enter friend's email (e.g. friend@gmail.com)"
                  value={friendEmail}
                  onChange={(e) => setFriendEmail(e.target.value)}
                  className="share-email-input"
                  required
                />
                <select 
                  value={friendRole} 
                  onChange={(e) => setFriendRole(e.target.value)}
                  className="share-role-select"
                >
                  <option value="Can edit">Can edit</option>
                  <option value="Can view">Can view</option>
                </select>
                <button type="submit" className="share-send-submit-btn">
                  <Send size={15} />
                  <span>Send Plan</span>
                </button>
              </div>
              <textarea 
                placeholder="Add an optional custom note for your friend..."
                value={shareMessage}
                onChange={(e) => setShareMessage(e.target.value)}
                className="share-message-textarea"
                rows={2}
              />
            </form>

            {/* Share Method 2: One-Click WhatsApp & Web Share */}
            <div className="instant-share-options-row">
              <button 
                type="button" 
                className="instant-btn whatsapp-btn"
                onClick={handleWhatsAppShare}
              >
                <MessageSquare size={16} />
                <span>Share via WhatsApp</span>
              </button>

              <button 
                type="button" 
                className={`instant-btn copy-link-btn ${copiedLink ? 'copied' : ''}`}
                onClick={handleCopyLink}
              >
                {copiedLink ? <Check size={16} color="#22c55e" /> : <Copy size={16} />}
                <span>{copiedLink ? 'Link Copied!' : 'Copy Plan Link'}</span>
              </button>
            </div>

            {/* Active Tripmates List */}
            <div className="invited-friends-section">
              <label>Tripmates & Collaborators ({invitedFriends.length + 1})</label>
              <div className="friends-chips-list">
                <div className="friend-chip owner">
                  <div className="avatar-circle">ME</div>
                  <span>You (Trip Owner)</span>
                </div>
                {invitedFriends.map((friend, idx) => (
                  <div key={idx} className="friend-chip">
                    <div className="avatar-circle">{friend.slice(0, 2).toUpperCase()}</div>
                    <span className="friend-email-text">{friend}</span>
                    <span className="friend-role-badge">Editor</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          MOBILE FLOATING ACTION BUTTON (FAB) FOR EVENT CREATION
          ========================================================================= */}
      <button 
        type="button" 
        className="gcal-mobile-fab-btn"
        onClick={() => {
          setCreateForm({
            title: '',
            dayIndex: 5,
            startTime: '14:00',
            endTime: '15:00',
            color: '#0284c7',
            category: 'Trip Activity',
            description: ''
          });
          setShowCreateModal(true);
        }}
        title="Create event"
      >
        <Plus size={26} />
      </button>

      {/* =========================================================================
          MOBILE SIDEBAR DRAWER (Triggered by Hamburger on Mobile)
          ========================================================================= */}
      {mobileDrawerOpen && (
        <>
          <div className="modal-backdrop" onClick={() => setMobileDrawerOpen(false)} />
          <div className="gcal-mobile-drawer custom-scroll">
            <div className="mobile-drawer-header">
              <div className="gcal-brand-icon-box">
                <span className="gcal-icon-num">31</span>
              </div>
              <span className="drawer-title">Google Calendar</span>
              <button 
                type="button" 
                className="close-drawer-btn" 
                onClick={() => setMobileDrawerOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            {/* + Create Button in Drawer */}
            <button 
              type="button" 
              className="gcal-create-pill-btn mobile-drawer-create"
              onClick={() => {
                setMobileDrawerOpen(false);
                setShowCreateModal(true);
              }}
            >
              <Plus size={20} className="create-plus-icon" />
              <span>Create Event</span>
            </button>

            {/* Mini Month Calendar */}
            <div className="gcal-mini-calendar-widget">
              <div className="mini-cal-header-row">
                <span className="mini-cal-month-title">{MINI_CAL_MONTHS[miniCalMonth]} {miniCalYear}</span>
              </div>
              <div className="mini-cal-weekdays">
                <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
              </div>
              <div className="mini-cal-days-grid">
                {miniCalDays.map((d, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`mini-day-cell ${!d.inCurrentMonth ? 'dimmed' : ''} ${d.isHighlight ? 'active-highlight' : ''}`}
                    onClick={() => {
                      setSelectedMiniDay(d.dayNum);
                      setMobileDrawerOpen(false);
                    }}
                  >
                    {d.dayNum}
                  </button>
                ))}
              </div>
            </div>

            {/* Checkboxes in Drawer */}
            <div className="drawer-checkboxes">
              <label className="gcal-checkbox-row">
                <input 
                  type="checkbox" 
                  checked={calFilterAdmin}
                  onChange={(e) => setCalFilterAdmin(e.target.checked)}
                  className="custom-gcal-checkbox blue-chk"
                />
                <span className="chk-label">System Administrator</span>
              </label>

              <label className="gcal-checkbox-row">
                <input 
                  type="checkbox" 
                  checked={calFilterHolidays}
                  onChange={(e) => setCalFilterHolidays(e.target.checked)}
                  className="custom-gcal-checkbox purple-chk"
                />
                <span className="chk-label">Holidays in India</span>
              </label>
            </div>
          </div>
        </>
      )}

      {/* =========================================================================
          MODAL 1: EVENT DETAILS VIEW
          ========================================================================= */}
      {selectedEvent && (
        <div className="modal-backdrop" onClick={() => setSelectedEvent(null)}>
          <div className="gcal-dark-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-actions">
              <div className="modal-color-strip" style={{ backgroundColor: selectedEvent.color }} />
              <div className="modal-actions-right">
                <button 
                  type="button" 
                  className="modal-icon-action" 
                  onClick={() => handleDeleteEvent(selectedEvent.id)}
                  title="Delete event"
                >
                  <Trash2 size={16} color="#ef4444" />
                </button>
                <button 
                  type="button" 
                  className="modal-icon-action" 
                  onClick={() => setSelectedEvent(null)}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="modal-body-content">
              <h3 className="event-modal-title">{selectedEvent.fullTitle}</h3>
              
              <div className="event-modal-meta-row">
                <Clock size={16} className="modal-meta-icon" />
                <span>{selectedEvent.timeDisplay} • {selectedEvent.date}</span>
              </div>

              <div className="event-modal-meta-row">
                <Layers size={16} className="modal-meta-icon" />
                <span>Category: {selectedEvent.category}</span>
              </div>

              <p className="event-modal-desc">{selectedEvent.description}</p>

              <div className="event-modal-footer">
                <button 
                  type="button" 
                  className="gcal-action-btn primary"
                  onClick={() => {
                    setSelectedEvent(null);
                    navigate('/itinerary-view');
                  }}
                >
                  <span>View Trip Itinerary</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: CREATE EVENT / SCHEDULE
          ========================================================================= */}
      {showCreateModal && (
        <div className="modal-backdrop" onClick={() => setShowCreateModal(false)}>
          <div className="gcal-dark-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create New Event / Trip Schedule</h3>
              <button type="button" className="close-btn" onClick={() => setShowCreateModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="create-event-form">
              <div className="form-group">
                <label>Event Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. Flight to Paris, Team Sync, Hotel Check-in"
                  value={createForm.title}
                  onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                  required
                  autoFocus
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Day of Week</label>
                  <select
                    value={createForm.dayIndex}
                    onChange={(e) => setCreateForm({ ...createForm, dayIndex: parseInt(e.target.value) })}
                  >
                    {WEEK_DAYS.map((d, i) => (
                      <option key={i} value={i}>{d.name} ({d.dateStr})</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Color Code</label>
                  <select
                    value={createForm.color}
                    onChange={(e) => setCreateForm({ ...createForm, color: e.target.value })}
                  >
                    <option value="#0284c7">Sky Blue</option>
                    <option value="#9333ea">Purple</option>
                    <option value="#f59e0b">Amber Yellow</option>
                    <option value="#10b981">Mint Green</option>
                    <option value="#06b6d4">Cyan</option>
                    <option value="#c026d3">Magenta</option>
                    <option value="#6366f1">Indigo</option>
                  </select>
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Start Time</label>
                  <input 
                    type="time" 
                    value={createForm.startTime}
                    onChange={(e) => setCreateForm({ ...createForm, startTime: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>End Time</label>
                  <input 
                    type="time" 
                    value={createForm.endTime}
                    onChange={(e) => setCreateForm({ ...createForm, endTime: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description & Notes</label>
                <textarea 
                  rows={2}
                  placeholder="Add notes, location details, or booking confirmation..."
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                />
              </div>

              <button type="submit" className="create-save-submit-btn">
                Save Event
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default CalendarViewPage;
