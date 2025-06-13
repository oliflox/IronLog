import React from 'react';
import { Modal, Pressable, Text, TouchableWithoutFeedback, View } from 'react-native';
import { popupStyles } from '../styles/popup';

interface GlobalPopupProps {
  visible: boolean;
  message: string;
  onClose: () => void;
}

const GlobalPopup: React.FC<GlobalPopupProps> = ({ visible, message, onClose }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={popupStyles.centeredView}>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View style={popupStyles.modalView}>
              <Text style={popupStyles.modalText}>{message}</Text>
              <Pressable
                style={[popupStyles.button, popupStyles.buttonClose]}
                onPress={onClose}
              >
                <Text style={popupStyles.textStyle}>Fermer</Text>
              </Pressable>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default GlobalPopup; 