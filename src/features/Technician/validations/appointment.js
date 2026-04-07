/**
 * Validate appointment form data
 * @param {Object} data - { datetime: string }
 * @returns {Object} errors - { field: errorMessage }
 */
export function validateAppointment(data) {
  const errors = {};

  if (!data.datetime || !data.datetime.trim()) {
    errors.datetime = "Please select a date and time.";
  } else {
    const appointmentDate = new Date(data.datetime);
    const now = new Date();

    if (isNaN(appointmentDate.getTime())) {
      errors.datetime = "Invalid date format.";
    } else if (appointmentDate < now) {
      errors.datetime = "Appointment must be in the future.";
    }
  }

  return errors;
}
