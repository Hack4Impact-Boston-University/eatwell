import { strict } from 'assert'
import cookies from 'js-cookie'

export const getUserFromCookie = () => {
  const cookie = cookies.get('auth')
  if (!cookie) {
    return
  }
  return JSON.parse(cookie)
}

export const setUserCookie = (user) => {
  cookies.set('auth', user, {
    // firebase id tokens expire in one hour
    // set cookie expiry to match
    expires: 1 / 24,
    //secure: true,
    sameSite: "lax",
  })
}

export const editUserCookie = (updateData) => {
  const cookie = cookies.get('auth') || '{}';
  var data = JSON.parse(cookie);
  Object.keys(updateData).forEach((key) => {
    if(key in data) {
      data[key] = updateData[key];
    }
  })
  setUserCookie(data);
}

export const removeUserCookie = () => cookies.remove('auth')


export const getFavsFromCookie = () => {
  const cookie = cookies.get('fav')
  if (!cookie) {
    return
  }
  return JSON.parse(cookie)
}

export const setFavCookie = (favs) => {
  cookies.set('fav', favs, {
    // firebase id tokens expire in one hour
    // set cookie expiry to match
    expires: 1 / 24,
    //secure: true,
    sameSite: "lax",
  })
}

export const editFavCookie = (dishID, add) => {
  const cookie = cookies.get('fav') || '{}';
  var data = JSON.parse(cookie);
  if(add) {
    data[dishID] = "";
  }
  else {
    delete data[dishID]
  }
  setFavCookie(data);
}

export const removeFavCookie = () => cookies.remove('fav')

export const getNotesFromCookie = () => {
  const cookie = cookies.get('notes')
  if (!cookie) {
    return
  }
  return JSON.parse(cookie)
}

export const setNotesCookie = (notes) => {
  cookies.set('notes', notes, {
    // firebase id tokens expire in one hour
    // set cookie expiry to match
    expires: 1 / 24,
    //secure: true,
    sameSite: "lax",
  })
}

export const editNotesCookie = (dishID, notes) => {
  const cookie = cookies.get('notes') || '{}';
  var data = JSON.parse(cookie);
  if(notes === undefined || notes.length == 0) {
    delete data[dishID]
  }
  else {
    data[dishID] = notes;
  }
  setNotesCookie(data);
}

export const removeNotesCookie = () => cookies.remove('notes')

export const getRatingsFromCookie = () => {
  const cookie = cookies.get('ratings')
  if (!cookie) {
    return
  }
  return JSON.parse(cookie)
}

export const setRatingsCookie = (rates) => {
  cookies.set('ratings', rates, {
    // firebase id tokens expire in one hour
    // set cookie expiry to match
    expires: 1 / 24,
    //secure: true,
    sameSite: "lax",
  })
}

export const editRatingsCookie = (dishID, rating) => {
  const cookie = cookies.get('ratings') || '{}';
  var data = JSON.parse(cookie);
  if(rating == 0) {
    delete data[dishID]
  }
  else {
    data[dishID] = rating;
  }
  setRatingsCookie(data);
}

export const removeRatingsCookie = () => cookies.remove('ratings')