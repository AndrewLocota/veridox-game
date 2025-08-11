import React from "react";
import "./EducationalFeedback.css";

const EducationalFeedback = ({
  isVisible,
  document,
  userChoice,
  onClose,
  onContinue,
}) => {
  if (!isVisible || !document) return null;

  const isCorrect = userChoice === document.isReal;

  return (
    <div className="educational-overlay">
      <div className="educational-modal">
        <div
          className={`feedback-header ${isCorrect ? "correct" : "incorrect"}`}
        >
          <h2>{isCorrect ? "✓ Correct!" : "✗ Incorrect"}</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="feedback-content">
          <div className="document-info">
            <h3>{document.type}</h3>
            <p className="document-description">{document.description}</p>
            <p className="correct-answer">
              This document is:{" "}
              <strong>{document.isReal ? "REAL" : "FAKE"}</strong>
            </p>
          </div>

          {!isCorrect && (
            <div className="educational-section">
              <h4>🎓 Learning Opportunity</h4>
              <p className="wrong-explanation">
                {document.educationalNotes.whenWrong}
              </p>

              <div className="key-indicators">
                <h5>Key Indicators:</h5>
                <p>{document.educationalNotes.keyIndicators}</p>
              </div>

              {document.forgeryDetails && (
                <div className="forgery-details">
                  <h5>Forgery Details:</h5>
                  <ul>
                    {document.forgeryDetails.detectionClues.map(
                      (clue, index) => (
                        <li key={index}>{clue}</li>
                      )
                    )}
                  </ul>
                </div>
              )}

              {document.securityFeatures && (
                <div className="security-features">
                  <h5>Security Features to Look For:</h5>
                  <ul>
                    {document.securityFeatures.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {isCorrect && (
            <div className="positive-reinforcement">
              <h4>🎯 Well Done!</h4>
              <p>{document.educationalNotes.keyIndicators}</p>
            </div>
          )}
        </div>

        <div className="feedback-actions">
          <button className="continue-btn" onClick={onContinue}>
            Continue Learning
          </button>
        </div>
      </div>
    </div>
  );
};

export default EducationalFeedback;
