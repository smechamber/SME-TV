import type { Dispatch, SetStateAction } from 'react';
import { Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import type { EventItem, Registration } from '../types';
import styles from '../styles';

type Props = {
  selectedEvent: EventItem | null;
  registration: Registration;
  setRegistration: Dispatch<SetStateAction<Registration>>;
  submitting: boolean;
  formNotice: string;
  onClose: () => void;
  onSubmit: () => void;
};

export default function EventRegistrationModal(props: Props) {
  const {
    selectedEvent,
    registration,
    setRegistration,
    submitting,
    formNotice,
    onClose,
    onSubmit,
  } = props;
  return (
    <Modal visible={Boolean(selectedEvent)} animationType="slide" onRequestClose={() => onClose()}>
      <ScrollView style={styles.modal} contentContainerStyle={styles.modalContent}>
        <Pressable onPress={() => onClose()}>
          <Text style={styles.close}>Close</Text>
        </Pressable>
        <Text style={styles.kicker}>EVENT REGISTRATION</Text>
        <Text style={styles.pageTitle}>{selectedEvent?.title}</Text>
        <Text style={styles.muted}>Please complete all required fields.</Text>
        {(
          [
            'name',
            'designation',
            'companyName',
            'businessActivity',
            'specificInterest',
            'email',
            'mobile',
            'city',
            'state',
          ] as (keyof Registration)[]
        ).map((key) => (
          <TextInput
            key={key}
            style={styles.formInput}
            placeholder={`${key === 'companyName' ? 'Company name' : key === 'businessActivity' ? 'Business activity' : key === 'specificInterest' ? 'Specific interest' : key[0].toUpperCase() + key.slice(1)} *`}
            placeholderTextColor="#928d9a"
            value={String(registration[key])}
            onChangeText={(value) => setRegistration((prev) => ({ ...prev, [key]: value }))}
            keyboardType={
              key === 'email' ? 'email-address' : key === 'mobile' ? 'phone-pad' : 'default'
            }
            autoCapitalize={key === 'email' ? 'none' : 'sentences'}
          />
        ))}
        <Pressable
          onPress={() => setRegistration((prev) => ({ ...prev, consent: !prev.consent }))}
          style={styles.consent}
        >
          <Text style={styles.checkbox}>{registration.consent ? '[x]' : '[ ]'}</Text>
          <Text style={styles.muted}>
            I agree to the privacy notice and consent to being contacted about this event.
          </Text>
        </Pressable>
        {formNotice ? (
          <Text style={formNotice.includes('confirmed') ? styles.success : styles.formError}>
            {formNotice}
          </Text>
        ) : null}
        <Pressable
          style={[styles.pinkButton, submitting && { opacity: 0.6 }]}
          disabled={submitting}
          onPress={onSubmit}
        >
          <Text style={styles.pinkButtonText}>
            {submitting ? 'Submitting...' : 'Submit registration'}
          </Text>
        </Pressable>
      </ScrollView>
    </Modal>
  );
}
