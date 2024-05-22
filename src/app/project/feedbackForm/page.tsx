"use client";
import { useState } from "react";
import "./style.css";
import { Button, Radio, Input } from "basicui";
const FeedbackForm = () => {
  const questions = [
    "Question 1",
    "Question 2",
    "Question 3",
    "Question 4",
    "Question 5",
  ];

  const options = ["Excellent", "Good", "Average", "Poor"];

  const [feedback, setFeedback] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [email, setEmail] = useState(null);
  const handleChange = (e) => {
    console.log(e.target);
    const { name, value } = e.target;
    setFeedback((prevFeedback) => ({
      ...prevFeedback,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);

    for (let i = 0; i < questions.length; i++) {
      const questionKey = `question${i + 1}`;
      if (!feedback.hasOwnProperty(questionKey)) {
        console.log("Please answer all questions.");
        return;
      }
    }

    console.log(feedback);
    setFeedback({});
    setFormSubmitted(false);
  };

  return (
    <div className="page">
        <h2 className="form_title">Feedback Form</h2>
      <div className="email_container">
        <Input
          label="E-mail"
          name="email"
          value={email}
          onInput={handleChange}
        />
      </div>
      <form onSubmit={handleSubmit} className="feedback_form">
        
        {questions.map((question, index) => (
          <div key={index} className="question_container">
            <label className="question_label">
              <h5>{question}:</h5>
            </label>
            <div className="options_container">
              {options.map((option, i) => (
                <div key={i} className="option_item">
                  {/* <input type="radio" name={`question${index + 1}`} value={option} onChange={handleChange} className="radioButton" required /> */}
                  <Radio
                    theme="primary"
                    name={`question${index + 1}`}
                    value={option}
                    label={option}
                    onChange={handleChange}
                    required
                  ></Radio>
                  {/* <span>{option}</span> */}
                </div>
              ))}
            </div>
          </div>
        ))}
        {formSubmitted && (
          <p style={{ color: "red" }}>Please answer all questions.</p>
        )}
        <div className="submit_button_container">
          <Button type="submit" theme="primary">
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;
