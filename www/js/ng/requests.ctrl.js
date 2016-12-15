angular.module('starter.controllers')
.controller('RequestsCtrl', function(UserService, $timeout, toasty, $q) {
  var vm = this;

  vm.sent = [];
  vm.received = [];

  var pollRequests = function(){

    $q.all([
      UserService.getReceived(),
      UserService.getSent(),
    ]).then(function(result){
      vm.received = result[0].data;
      vm.sent = result[1].data

      // Only keep polling when there are no errors
      $timeout(pollRequests, 2000);

    }, function(error){
      toasty.error({
            msg: 'There was a problem getting the requests.',
            showClose: true,
            clickToClose: true,
            timeout: 5000,
            sound: false,
            html: true,
            shake: false,
            theme: "material"
        });
    })
  }
  pollRequests();





})
