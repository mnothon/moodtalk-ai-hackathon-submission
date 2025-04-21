import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

export const randomAlphanumeric = (length: number) => {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = length; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};

export const getStringFromDate = (date: Date) => {
  return date.toISOString().split('T')[0];
};

export const getDateFromString = (dateString: string | undefined) => {
  if (!dateString) {
    return new Date();
  }

  const date = new Date(dateString);
  date.setHours(12);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);

  return date;
};

export const getCurrentDate = () => {
  const date = new Date();
  return getStringFromDate(date);
};

export const getCurrentDateTime = () => {
  return getStringFromDatetime(new Date());
};

export const getStringFromDatetime = (date: Date): string => {
  const pad = (value: number) => {
    return value < 10 ? '0' + value : value;
  };

  const createOffset = (date: Date) => {
    const sign = date.getTimezoneOffset() > 0 ? '-' : '+';
    const offset = Math.abs(date.getTimezoneOffset());
    const hours = pad(Math.floor(offset / 60));
    const minutes = pad(offset % 60);
    return sign + hours + ':' + minutes;
  };

  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  const hour = ('0' + date.getHours()).slice(-2);
  const minute = ('0' + date.getMinutes()).slice(-2);
  const second = ('0' + date.getSeconds()).slice(-2);
  return date.getFullYear() + '-' + month + '-' + day + 'T' + hour + ':' + minute + ':' + second + createOffset(date);
};

export const getNgbDate = (date: Date): NgbDateStruct => {
  return {
    day: date.getDate(),
    month: date.getMonth() + 1,
    year: date.getFullYear()
  };
};

export const fromNgbDate = (date: NgbDateStruct | undefined | null): Date => {
  if (!date) {
    return new Date();
  }
  return new Date(date?.year, date?.month - 1, date?.day, 12);
};

export const scrollTo = (el: Element, containerElement?: Element) => {
  if (containerElement === undefined) {
    const scrollPosition = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: scrollPosition,
      behavior: 'smooth'
    });
  } else {
    const scrollPosition = el.getBoundingClientRect().top + containerElement.scrollTop;
    containerElement.scrollTo({
      top: scrollPosition - containerElement.getBoundingClientRect().top,
      behavior: 'smooth'
    });
  }
};

export const scrollToTop = (containerElement?: Element) => {
  if (containerElement === undefined) {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  } else {
    containerElement.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
};

export const scrollToFragment = (fragment: string, timeout = 0) => {
  setTimeout(() => {
    const element = document.getElementById(fragment);

    if (element === null) {
      return;
    }

    scrollTo(element);
  }, timeout);
};

export const getLocale = (defaultLocale = 'de-CH') => {
  if ($localize.locale === undefined) {
    return defaultLocale;
  }

  switch ($localize.locale) {
    case 'de':
      return 'de-CH';
    case 'fr':
      return 'fr-CH';
    case 'it':
      return 'it-CH';
    case 'en':
      return 'en';
    default:
      return defaultLocale;
  }
};

export const getCurrentTimeStampAsString = (): string => {
  return new Date().toISOString();
}
