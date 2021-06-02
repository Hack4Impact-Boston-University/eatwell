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

export const getFavsSkillsFromCookie = () => {
  const cookie = cookies.get('favSkills')
  if (!cookie) {
    return
  }
  return JSON.parse(cookie)
}

export const getFavsTipsFromCookie = () => {
  const cookie = cookies.get('favTips')
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

export const setFavSkillsCookie = (favs) => {
  cookies.set('favSkills', favs, {
    // firebase id tokens expire in one hour
    // set cookie expiry to match
    expires: 1 / 24,
    //secure: true,
    sameSite: "lax",
  })
}

export const setFavTipsCookie = (favs) => {
  cookies.set('favTips', favs, {
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

export const editFavSkillsCookie = (skillID, add) => {
  const cookie = cookies.get('favSkills') || '{}';
  var data = JSON.parse(cookie);
  if(add) {
    data[skillID] = "";
  }
  else {
    delete data[skillID]
  }
  setFavCookie(data);
}

export const editFavTipsCookie = (tipID, add) => {
  const cookie = cookies.get('favTips') || '{}';
  var data = JSON.parse(cookie);
  if(add) {
    data[tipID] = "";
  }
  else {
    delete data[tipID]
  }
  setFavCookie(data);
}

export const removeFavCookie = () => cookies.remove('fav')
export const removeFavSkillsCookie = () => cookies.remove('favSkills')
export const removeFavTipsCookie = () => cookies.remove('favTips')

export const getRatingsFromCookie = () => {
  const cookie = cookies.get('ratings')
  if (!cookie) {
    return
  }
  return JSON.parse(cookie)
}

export const getRatingsSkillsFromCookie = () => {
  const cookie = cookies.get('ratingsSkills')
  if (!cookie) {
    return
  }
  return JSON.parse(cookie)
}

export const getRatingsTipsFromCookie = () => {
  const cookie = cookies.get('ratingsTips')
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

export const setRatingsSkillsCookie = (rates) => {
  cookies.set('ratingsSkills', rates, {
    // firebase id tokens expire in one hour
    // set cookie expiry to match
    expires: 1 / 24,
    //secure: true,
    sameSite: "lax",
  })
}

export const setRatingsTipsCookie = (rates) => {
  cookies.set('ratingsTips', rates, {
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

export const editRatingsSkillsCookie = (skillID, rating) => {
  const cookie = cookies.get('ratingsSkills') || '{}';
  var data = JSON.parse(cookie);
  if(rating == 0) {
    delete data[skillID]
  }
  else {
    data[skillID] = rating;
  }
  setRatingsSkillsCookie(data);
}

export const editRatingsTipsCookie = (tipID, rating) => {
  const cookie = cookies.get('ratingsTips') || '{}';
  var data = JSON.parse(cookie);
  if(rating == 0) {
    delete data[tipID]
  }
  else {
    data[tipID] = rating;
  }
  setRatingsTipsCookie(data);
}

export const removeRatingsCookie = () => cookies.remove('ratings')
export const removeRatingsSkillsCookie = () => cookies.remove('ratingsSkills')
export const removeRatingsTipsCookie = () => cookies.remove('ratingsTips')