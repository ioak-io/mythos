import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Radio,
  Textarea,
  ThemeType,
} from "basicui";
import "./style.css";
import { useState } from "react";

interface Props {
  question: { question: string; answer: string; choices: string[] };
  index: number;
  onChange: any;
}

const ObjectiveQuestion = (props: Props) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const editQuestion = () => {};

  const deleteQuestion = () => {};

  return (
    <>
      <div className="objective-question">
        <div>
          {props.index + 1}. {props.question.question}
        </div>
        <div className="objective-question__choices">
          {props.question.choices.map((item: string) => (
            <Radio
              disabled
              key={item}
              label={item}
              name={item}
              checked={item === props.question.answer}
            />
          ))}
        </div>
        <div className="objective-question__action">
          <Button onClick={() => setIsEditDialogOpen(true)}>Edit</Button>
          <Button onClick={deleteQuestion}>Delete</Button>
        </div>
      </div>
      <Modal
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(!isEditDialogOpen)}
      >
        <ModalHeader
          heading={`Question ${props.index + 1}`}
          onClose={() => setIsEditDialogOpen(false)}
        />
        <ModalBody>
          <div className="objective-question-edit">
            <Textarea value={props.question.question} rows="10" />
            <div className="objective-question__choices">
              {props.question.choices.map((item: string) => (
                <div className="objective-question__choices__choice" key={item}>
                  <Radio
                    disabled
                    name={item}
                    checked={item === props.question.answer}
                  />
                  <Input value={item} />
                </div>
              ))}
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button theme={ThemeType.primary}>Save</Button>
          <Button onClick={() => setIsEditDialogOpen(false)}>Close</Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default ObjectiveQuestion;
