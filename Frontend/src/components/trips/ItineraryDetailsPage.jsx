import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../common/Navbar.jsx';
import Footer from '../landing/Footer.jsx';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Layers,
  MapPin,
  Clock,
  ArrowDown,
  DollarSign,
  Calendar,
  CheckCircle,
  Share2,
  Download,
  Compass
} from 'lucide-react';
import './style/ItineraryDetailsPage.css';

const ITINERARY_DAYS = [
  {
    dayNumber: 1,
    dayTitle: 'Arrival in Zurich & Alpine Train to Interlaken',
    activities: [
      {
        id: 'd1-a1',
        time: '09:00 AM',
        title: 'Zurich Airport Arrival & Swiss Rail Pass Activation',
        location: 'Zurich International Airport',
        type: 'Transit',
        expense: 120
      },
      {
        id: 'd1-a2',
        time: '12:30 PM',
        title: 'Scenic Panorama Train to Interlaken & Hotel Check-in',
        location: 'Interlaken Ost & Grand Alpine Lodge',
        type: 'Lodging & Transit',
        expense: 340
      },
      {
        id: 'd1-a3',
        time: '04:30 PM',
        title: 'Harder Kulm Funicular Sunset Viewpoint & Swiss Fondue Dinner',
        location: 'Harder Kulm Peak Restaurant',
        type: 'Dining & Sightseeing',
        expense: 85
      }
    ]
  },
  {
    dayNumber: 2,
    dayTitle: 'Jungfraujoch Top of Europe & Glacier Ice Palace',
    activities: [
      {
        id: 'd2-a1',
        time: '08:30 AM',
        title: 'Eiger Express Tricable Gondola Ascent to Jungfraujoch',
        location: 'Grindelwald Terminal',
        type: 'Mountain Transit',
        expense: 210
      },
      {
        id: 'd2-a2',
        time: '11:30 AM',
        title: 'Guided Ice Palace Exploration & Sphinx Observatory Walk',
        location: 'Jungfraujoch Glacier Peak (3,454m)',
        type: 'Excursion',
        expense: 45
      },
      {
        id: 'd2-a3',
        time: '03:00 PM',
        title: 'Lauterbrunnen Valley Walk & Staubbach Falls Waterfall',
        location: 'Lauterbrunnen Valley',
        type: 'Nature Trekking',
        expense: 25
      }
    ]
  },
  {
    dayNumber: 3,
    dayTitle: 'Lake Brienz Steamboat & Tandem Paragliding',
    activities: [
      {
        id: 'd3-a1',
        time: '09:30 AM',
        title: 'Lake Brienz Historic Turquoise Waters Steamboat Cruise',
        location: 'Brienz Harbor',
        type: 'Water Excursion',
        expense: 65
      },
      {
        id: 'd3-a2',
        time: '01:30 PM',
        title: 'Tandem Paragliding Flight from Beatenberg to Interlaken',
        location: 'Höhematte Park Landing',
        type: 'Adventure Sport',
        expense: 190
      },
      {
        id: 'd3-a3',
        time: '06:30 PM',
        title: 'Traditional Alpine Artisan Chocolate Tasting & Farewell Dinner',
        location: 'Interlaken Old Town',
        type: 'Culinary Experience',
        expense: 95
      }
    ]
  }
];

const ItineraryDetailsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const stateData = location.state || {};

  const tripTitle = stateData.tripTitle || 'Swiss Alps & Bernese Oberland Grand Itinerary';
  const destination = stateData.destination || 'Interlaken, Jungfrau & Zurich, Switzerland';

  const totalExpense = ITINERARY_DAYS.reduce(
    (total, day) =>
      total + day.activities.reduce((dTotal, a) => dTotal + a.expense, 0),
    0
  );

  return (
    <div className="itinerary-details-page-container">
      <Navbar />

      <main className="itinerary-details-main">
        {/* Page Header */}
        <div className="itinerary-header-banner">
          <div>
            <span className="screen-badge">Screen 9 • Itinerary View & Budget Breakdown</span>
            <h1 className="itinerary-main-heading">Itinerary for {destination}</h1>
            <p className="itinerary-sub-heading">{tripTitle}</p>
          </div>

          <div className="itinerary-actions-box">
            <div className="total-budget-card">
              <span className="budget-title">Total Trip Expenses</span>
              <span className="budget-val">${totalExpense.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Controls Toolbar matching wireframe */}
        <div className="controls-toolbar">
          <div className="search-bar-wrapper">
            <Search size={18} className="search-input-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search itinerary activities or expenses..."
            />
          </div>

          <div className="filter-controls-group">
            <button className="control-btn">
              <Layers size={15} />
              <span>Group by: Day</span>
            </button>
            <button className="control-btn">
              <SlidersHorizontal size={15} />
              <span>Filter: All Activities</span>
            </button>
            <button className="control-btn">
              <ArrowUpDown size={15} />
              <span>Sort by: Time Flow</span>
            </button>
          </div>
        </div>

        {/* Itinerary Schedule Sequence Days matching wireframe */}
        <section className="days-schedule-container">
          {ITINERARY_DAYS.map((day) => {
            const dayExpense = day.activities.reduce(
              (sum, a) => sum + a.expense,
              0
            );

            return (
              <div key={day.dayNumber} className="day-schedule-card">
                {/* Day Header Row */}
                <div className="day-card-header">
                  <div className="day-badge-box">
                    <span className="day-badge-pill">Day {day.dayNumber}</span>
                    <h3 className="day-title-text">{day.dayTitle}</h3>
                  </div>

                  <div className="day-expense-pill">
                    <span>Day Total: </span>
                    <strong>${dayExpense}</strong>
                  </div>
                </div>

                {/* Grid Table: Physical Activity (Left) vs Expense (Right) matching wireframe */}
                <div className="activity-expense-table-header">
                  <span className="col-header left">Physical Activity & Flow</span>
                  <span className="col-header right">Expense</span>
                </div>

                <div className="activities-flow-list">
                  {day.activities.map((activity, index) => (
                    <React.Fragment key={activity.id}>
                      <div className="activity-flow-row">
                        {/* Left Column: Physical Activity Box */}
                        <div className="activity-info-box">
                          <div className="activity-time-tag">
                            <Clock size={13} color="#a78bfa" />
                            <span>{activity.time}</span>
                          </div>
                          <h4 className="activity-name">{activity.title}</h4>
                          <div className="activity-loc-type">
                            <span className="act-location">
                              <MapPin size={13} color="#a78bfa" />
                              {activity.location}
                            </span>
                            <span className="act-type-pill">{activity.type}</span>
                          </div>
                        </div>

                        {/* Right Column: Expense Box */}
                        <div className="activity-expense-box">
                          <span className="expense-currency">$</span>
                          <span className="expense-number">{activity.expense}</span>
                        </div>
                      </div>

                      {/* Connecting Arrow between sequential activities */}
                      {index < day.activities.length - 1 && (
                        <div className="activity-flow-arrow-row">
                          <div className="arrow-down-icon-box">
                            <ArrowDown size={16} color="#a78bfa" />
                          </div>
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            );
          })}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ItineraryDetailsPage;
