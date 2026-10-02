const roles = ['Citizen', 'Field Inspector', 'Administrator'];
const priorities = ['Low', 'Medium', 'High'];
const addressFields = ['houseNumber', 'street', 'barangay', 'city'];
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const transitions = {
  'Field Inspector': {
    New: ['Under Review', 'Verified', 'Needs Information', 'Rejected'],
    'Under Review': ['Verified', 'Needs Information', 'Rejected'],
    'Needs Information': ['Under Review', 'Verified', 'Needs Information', 'Rejected'],
    Verified: ['Ongoing'],
  },
  Administrator: {
    Verified: ['Ongoing', 'Closed'],
    Ongoing: ['Closed'],
  },
};

function validateUserInput(input, { administrator = false } = {}) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { error: 'A user object is required.' };
  }
  if (
    typeof input.firstName !== 'string' ||
    typeof input.lastName !== 'string' ||
    typeof input.email !== 'string' ||
    typeof input.password !== 'string'
  ) {
    return { error: 'Name, email, and password fields must be text.' };
  }

  const firstName = String(input.firstName || '').trim();
  const lastName = String(input.lastName || '').trim();
  const email = String(input.email || '').trim().toLowerCase();
  const password = String(input.password || '');

  if (!firstName || !lastName || firstName.length > 100 || lastName.length > 100) {
    return { error: 'First and last name are required and must be at most 100 characters.' };
  }
  if (email.length > 254 || !emailPattern.test(email)) {
    return { error: 'A valid email address is required.' };
  }
  if (password.length < 6 || password.length > 128) {
    return { error: 'Password must contain between 6 and 128 characters.' };
  }

  if (administrator) {
    if (typeof input.role !== 'string' || !roles.includes(input.role)) {
      return { error: 'A supported user role is required.' };
    }
  } else {
    if (typeof input.birthday !== 'string' || typeof input.mobile !== 'string') {
      return { error: 'Birthday and mobile number must be text.' };
    }
    const birthday = input.birthday.trim();
    const birthdayParts = birthday.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    const birthYear = birthdayParts ? Number(birthdayParts[1]) : NaN;
    const birthMonth = birthdayParts ? Number(birthdayParts[2]) : NaN;
    const birthDay = birthdayParts ? Number(birthdayParts[3]) : NaN;
    const birthDate = new Date(birthYear, birthMonth - 1, birthDay);
    if (
      !birthdayParts ||
      Number.isNaN(birthDate.getTime()) ||
      birthDate.getFullYear() !== birthYear ||
      birthDate.getMonth() !== birthMonth - 1 ||
      birthDate.getDate() !== birthDay
    ) {
      return { error: 'A valid birthday is required.' };
    }

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    if (
      today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
    ) age--;
    if (age < 18) return { error: 'You must be at least 18 years old to register.' };

    const mobile = input.mobile.trim();
    const mobileDigits = mobile.replace(/\D/g, '');
    if (!/^\+?[\d\s()-]{7,20}$/.test(mobile) || mobileDigits.length < 7 || mobileDigits.length > 15) {
      return { error: 'A valid mobile number is required.' };
    }

    const address = input.address && typeof input.address === 'object' && !Array.isArray(input.address)
      ? input.address
      : {};
    const normalizedAddress = {};
    for (const field of addressFields) {
      if (typeof address[field] !== 'string') {
        return { error: 'All address fields must be text.' };
      }
      const value = address[field].trim();
      if (!value || value.length > 120) {
        return { error: 'All address fields are required and must be at most 120 characters.' };
      }
      normalizedAddress[field] = value;
    }

    return {
      value: {
        firstName,
        lastName,
        email,
        password,
        birthday,
        mobile,
        address: normalizedAddress,
        role: 'Citizen',
      },
    };
  }

  return {
    value: {
      firstName,
      lastName,
      email,
      password,
      role: input.role,
      birthday: '',
      mobile: '',
      address: Object.fromEntries(addressFields.map((field) => {
        const value = input.address?.[field];
        if (value !== undefined && typeof value !== 'string') {
          return [field, ''];
        }
        return [field, String(value || '').trim().slice(0, 120)];
      })),
    },
  };
}

function validateReportInput(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { error: 'A report object is required.' };
  }

  if (
    typeof input.category !== 'string' ||
    typeof input.location !== 'string' ||
    typeof input.description !== 'string' ||
    (input.evidence !== undefined && typeof input.evidence !== 'string')
  ) {
    return { error: 'Category, location, description, and evidence filename must be text.' };
  }

  const category = input.category.trim();
  const location = input.location.trim();
  const description = input.description.trim();
  const evidence = (input.evidence || '').trim();

  if (!category || !location || !description) {
    return { error: 'Category, location, and description are required.' };
  }
  if (category.length > 100 || location.length > 300 || description.length > 5000 || evidence.length > 255) {
    return { error: 'Category, location, description, or evidence filename exceeds its allowed length.' };
  }

  return { value: { category, location, description, evidence } };
}

function isPriority(value) {
  return priorities.includes(value);
}

function validateAssignmentInput(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { error: 'An assignment object is required.' };
  }
  if (typeof input.reportId !== 'string' || typeof input.assignedToEmail !== 'string') {
    return { error: 'Report ID and inspector email must be text.' };
  }

  const reportId = input.reportId.trim();
  const assignedToEmail = input.assignedToEmail.trim().toLowerCase();
  if (!reportId || reportId.length > 100 || !emailPattern.test(assignedToEmail)) {
    return { error: 'A valid report ID and inspector email are required.' };
  }
  return { value: { reportId, assignedToEmail } };
}

function canTransition(role, currentStatus, nextStatus) {
  return transitions[role]?.[currentStatus]?.includes(nextStatus) || false;
}

module.exports = {
  canTransition,
  isPriority,
  priorities,
  validateAssignmentInput,
  validateReportInput,
  validateUserInput,
};