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