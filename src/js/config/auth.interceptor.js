function authInterceptor($location, $q) {
  'ngInject'

  return {
    response: function(response) {
      // do something on success
      return response;
    },
    responseError: function(response) {
      if (response.status === 401)
        $location.url('/login');
      return $q.reject(response);
    }
  };
}

export default authInterceptor;