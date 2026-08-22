import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../common/Navbar.jsx';
import Footer from '../landing/Footer.jsx';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Layers,
  Calendar as CalendarIcon,
  MapPin,
  Clock,
  Plus,
  ArrowRight
} from 'lucide-react';
import './style/CalendarViewPage.css';

const CALENDAR_TRIPS = [
  {
    id: 't1',
    title: 'PARIS TRIP',
    location: 'Paris, France',
    color: '#6366f1',
    startDay: 4,
    endDay: 7,
    status: 'Upcoming',
    description: 'Eiffel Tower, Louvre Museum tour, and Montmartre art walk.'
  },
  {
    id: 't2',
    title: 'SWISS ALPS 10',
    location: 'Interlaken, Switzerland',
    color: '#10b981',
    startDay: 9,
    endDay: 11,
    status: 'Confirmed',
    description: 'Jungfraujoch glacier train and scenic valley cable car.'
  },
  {
    id: 't3',
    title: 'NYC - GETAWAY',
    location: 'New York, USA',
    color: '#f59e0b',
    startDay: 15,
    endDay: 22,
    status: 'Planned',
    description: 'Broadway theater, Central Park biking, and Brooklyn Bridge sunset.'
  },
  {
    id: 't4',
    title: 'JAPAN ADVENTURE',
    location: 'Kyoto & Tokyo, Japan',
    color: '#ec4899',
    startDay: 16,
    endDay: 20,
    status: 'Draft',
    description: 'Bamboo forest meditation, sushi tasting, and Shinkansen journey.'
  },
  {
    id: 't5',
    title: 'COASTAL GETAWAY',
    location: 'Santorini, Greece',
    color: '#38bdf8',
    startDay: 28,
    endDay: 30,
    status: 'Confirmed',
    description: 'Caldera sailing, cliffside villa stay, and Oia sunsets.'
  }
];

const CalendarViewPage = () => {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState('January 2026');
  const [selectedTrip, setSelectedTrip] = useState(CALENDAR_TRIPS[0]);

  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  // Calendar dates representation (31 days)
  const calendarGrid = [
    // Week 1
    [null, null, null, null, 1, 2, 3],
    // Week 2
    [4, 5, 6, 7, 8, 9, 10],
    // Week 3
    [11, 12, 13, 14, 15, 16, 17],
    // Week 4
    [18, 19, 20, 21, 22, 23, 24],
    // Week 5
    [25, 26, 27, 28, 29, 30, 31]
  ];

  const getTripsForDay = (day) => {
    if (!day) return [];
    return CALENDAR_TRIPS.filter((t) => day >= t.startDay && day <= t.endDay);
  };

  return (
    <div className="calendar-page-container">
      <Navbar />

      <main className="calendar-page-main">
        {/* Page Header */}
        <div className="page-header-row">
          <div>
            <span className="screen-badge">Screen 11 • Calendar View</span>
            <h1 className="page-main-heading">Trip Schedule Calendar</h1>
          </div>

          <button 
            className="add-calendar-trip-btn white-btn-black-text"
            onClick={() => navigate('/create-trip')}
          >
            <Plus size={16} />
            <span>Schedule New Trip</span>
          </button>
        </div>

        {/* Controls Toolbar matching wireframe */}
        <div className="controls-toolbar">
          <div className="search-bar-wrapper">
            <Search size={18} className="search-input-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search scheduled trips by destination or date..."
            />
          </div>

          <div className="filter-controls-group">
            <button className="control-btn">
              <Layers size={15} />
              <span>Group by: Month</span>
            </button>
            <button className="control-btn">
              <SlidersHorizontal size={15} />
              <span>Filter: All Trips</span>
            </button>
            <button className="control-btn">
              <ArrowUpDown size={15} />
              <span>Sort by: Date</span>
            </button>
          </div>
        </div>

        {/* Main Calendar Board Layout */}
        <div className="calendar-board-wrapper">
          <div className="calendar-left-grid-card">
            {/* Month Switcher Header */}
            <div className="month-navigation-bar">
              <button className="month-nav-arrow" title="Previous Month">
                <ChevronLeft size={20} />
              </button>
              <h2 className="current-month-label">{currentMonth}</h2>
              <button className="month-nav-arrow" title="Next Month">
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Days of week header */}
            <div className="days-header-row">
              {daysOfWeek.map((day) => (
                <div key={day} className="day-name-cell">
                  {day}
                </div>
              ))}
            </div>

            {/* Dates Grid with Trip Banner Indicators matching wireframe */}
            <div className="month-dates-grid">
              {calendarGrid.map((week, wIdx) => (
                <div key={wIdx} className="calendar-week-row">
                  {week.map((dateNum, dIdx) => {
                    const dayTrips = getTripsForDay(dateNum);
                    return (
                      <div
                        key={dIdx}
                        className={`calendar-date-cell ${!dateNum ? 'empty' : ''}`}
                      >
                        {dateNum && (
                          <>
                            <span className="date-number-label">{dateNum}</span>
                            <div className="date-trips-container">
                              {dayTrips.map((t) => (
                                <div
                                  key={t.id}
                                  className="trip-banner-strip"
                                  style={{
                                    backgroundColor: t.color,
                                    boxShadow: `0 2px 8px ${t.color}40`
                                  }}
                                  onClick={() => setSelectedTrip(t)}
                                  title={`${t.title}: ${t.location}`}
                                >
                                  <span>{t.title}</span>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Right Selected Trip Details Sidebar */}
          {selectedTrip && (
            <div className="calendar-trip-details-panel">
              <div className="panel-top-badge" style={{ backgroundColor: selectedTrip.color }}>
                {selectedTrip.status}
              </div>
              <h3 className="panel-trip-title">{selectedTrip.title}</h3>
              <div className="panel-meta-item">
                <MapPin size={15} color="#a78bfa" />
                <span>{selectedTrip.location}</span>
              </div>
              <div className="panel-meta-item">
                <CalendarIcon size={15} color="#a78bfa" />
                <span>January {selectedTrip.startDay} - January {selectedTrip.endDay}, 2026</span>
              </div>
              <p className="panel-desc">{selectedTrip.description}</p>

              <button
                className="panel-view-btn white-btn-black-text"
                onClick={() => navigate('/itinerary-view')}
              >
                <span>Open Itinerary Details</span>
                <ArrowRight size={15} />
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CalendarViewPage;
