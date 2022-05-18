import { Modal } from 'react-bootstrap';
import React, {useCallback, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ModalLayout.css';

function ModalLayout(props) {

    const handleSubmitModal = useCallback((e) => {
        if (e.key === 'Enter') {
            const customEvent = new CustomEvent('submit-modal');
            window.dispatchEvent(customEvent);
            props.toggle();
        } else if (e.key === 'Escape') {
            const customEvent = new CustomEvent('close-modal');
            window.dispatchEvent(customEvent);
            props.toggle();
        }
    }, [])

    useEffect(() => {
        document.body.addEventListener('keydown', handleSubmitModal);
        return function cleanup() {
            document.body.removeEventListener('keydown', handleSubmitModal);
        }
    }, [])


    return (
        <>
            <Modal show={props.isOpen}>
                <Modal.Body className="pl-3 pr-3">{props.children}</Modal.Body>
                <Modal.Footer>
                    <p>Press ENTER to submit, ESC to cancel</p>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalLayout;