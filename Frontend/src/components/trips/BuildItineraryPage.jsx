import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../common/Navbar.jsx';
import Footer from '../landing/Footer.jsx';
import {
  Layers,
  Plus,
  Trash2,
  Calendar,
  DollarSign,
  ArrowRight,
  Sparkles,
  CheckCircle,
  FileText
} from 'lucide-react';
import './style/BuildItineraryPage.css';

const INITIAL_SECTIONS = [
  {
    id: 1,
    title: 'Section 1: Departure & Hotel Arrival',
    description: 'International flight to Zurich, scenic alpine cogwheel train transfer to Interlaken, and check-in at mountain panoramic lodge.',
    dateRange: '10 Oct 2026 - 12 Oct 2026',
    budget: '850'
  },
  {
    id: 2,
    title: 'Section 2: High Alpine Trails & Glacier Exploration',
    description: 'Guided day-hike through Eiger trail, Jungfraujoch ice palace excursion, and evening traditional fondue dining.',
    dateRange: '13 Oct 2026 - 16 Oct 2026',
    budget: '650'
  },
  {
    id: 3,
    title: 'Section 3: Turquoise Lakes & Paragliding Adventure',
    description: 'Lake Brienz private steamboat cruise, tandem paragliding session above Interlaken valley, and souvenir artisan shopping.',
    dateRange: '17 Oct 2026 - 20 Oct 2026',
    budget: '450'
  }
];

const BuildItineraryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const stateData = location.state || {};

  const [tripTitle] = useState(stateData.tripName || 'Alpine Crest & Swiss Expedition');
  const [destination] = useState(stateData.selectedPlace || 'Interlaken & Zurich, Switzerland');
  const [sections, setSections] = useState(INITIAL_SECTIONS);

  const handleAddSection = () => {
    const nextId = sections.length + 1;
    setSections([
      ...sections,
      {
        id: nextId,
        title: `Section ${nextId}: New Activity / Travel Leg`,
        description: 'All the necessary information about this section. This can be anything like travel section, hotel or any other activity.',
        dateRange: '21 Oct 2026 - 24 Oct 2026',
        budget: '300'
      }
    ]);
  };

  const handleUpdateSection = (id, field, value) => {
    setSections(
      sections.map((sec) => (sec.id === id ? { ...sec, [field]: value } : sec))
    );
  };

  const handleDeleteSection = (id) => {
    if (sections.length <= 1) return;
    setSections(sections.filter((sec) => sec.id !== id));
  };

  const totalBudget = sections.reduce(
    (sum, sec) => sum + (parseFloat(sec.budget) || 0),
    0
  );

  const handleSaveItinerary = (e) => {
    e.preventDefault();
    // Navigate to Screen 9: Detailed Itinerary View
    navigate('/itinerary-view', {
      state: {
        tripTitle,
        destination,
        sections,
        totalBudget
      }
    });
  };

  return (
    <div className="itinerary-builder-container">
      <Navbar />

      <main className="itinerary-builder-main">
        <div className="builder-header-banner">
          <div>
            <span className="builder-screen-badge">Screen 5 • Itinerary Builder</span>
            <h1 className="builder-main-title">{tripTitle}</h1>
            <p className="builder-sub-title">Destination: {destination}</p>
          </div>
          <div className="builder-budget-badge">
            <span className="budget-label">Total Estimated Budget</span>
            <span className="budget-number">${totalBudget.toLocaleString()}</span>
          </div>
        </div>

        {/* Dynamic Itinerary Sections List */}
        <section className="sections-list-wrap">
          {sections.map((section, idx) => (
            <div key={section.id} className="section-card-box">
              <div className="section-card-top-bar">
                <div className="section-title-wrap">
                  <span className="section-index-badge">{idx + 1}</span>
                  <input
                    type="text"
                    className="section-title-input"
                    value={section.title}
                    onChange={(e) =>
                      handleUpdateSection(section.id, 'title', e.target.value)
                    }
                    placeholder={`Section ${idx + 1} Title`}
                  />
                </div>

                {sections.length > 1 && (
                  <button
                    type="button"
                    className="delete-section-btn"
                    onClick={() => handleDeleteSection(section.id)}
                    title="Remove Section"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              <div className="section-desc-wrap">
                <label className="section-input-label">
                  Section Details & Activity Notes
                </label>
                <textarea
                  className="section-desc-textarea"
                  rows={3}
                  value={section.description}
                  onChange={(e) =>
                    handleUpdateSection(section.id, 'description', e.target.value)
                  }
                  placeholder="All the necessary information about this section. This can be anything like travel section, hotel or any other activity"
                />
              </div>

              <div className="section-meta-inputs-grid">
                <div className="section-meta-group">
                  <label className="section-input-label">
                    <Calendar size={13} />
                    <span>Date Range</span>
                  </label>
                  <input
                    type="text"
                    className="section-meta-input"
                    value={section.dateRange}
                    onChange={(e) =>
                      handleUpdateSection(section.id, 'dateRange', e.target.value)
                    }
                    placeholder="e.g. 12 Oct to 15 Oct"
                  />
                </div>

                <div className="section-meta-group">
                  <label className="section-input-label">
                    <DollarSign size={13} />
                    <span>Budget of this section</span>
                  </label>
                  <input
                    type="number"
                    className="section-meta-input"
                    value={section.budget}
                    onChange={(e) =>
                      handleUpdateSection(section.id, 'budget', e.target.value)
                    }
                    placeholder="e.g. 500"
                  />
                </div>
              </div>
            </div>
          ))}

          {/* + Add Another Section Button matching wireframe */}
          <button
            type="button"
            className="add-section-dashed-btn"
            onClick={handleAddSection}
          >
            <Plus size={20} />
            <span>Add another Section</span>
          </button>
        </section>

        {/* Bottom Actions Bar */}
        <div className="builder-actions-bottom">
          <button
            type="button"
            className="save-itinerary-btn white-btn-black-text"
            onClick={handleSaveItinerary}
          >
            <span>Save & View Full Itinerary (Screen 9)</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BuildItineraryPage;
