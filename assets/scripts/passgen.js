angular.module('app', ['ui.bootstrap', 'angularBootstrapNumberpicker'])
  .controller('PasswordGeneratorController', ['$scope', function($scope) {
    $scope.includeLower = true;
    $scope.includeUpper = true;
    $scope.includeNumbers = true;
    $scope.includeSymbols = true;

    $scope.changeTooltip = function() {
      $scope.dynamicTooltip = 'Copied!';
    };

    var resetTooltip = function() {
      $scope.dynamicTooltip = 'Copy to clipboard';
    };

    $scope.generateNewPass = function() {
      $scope.newPassword = WeightedPasswordGen.genPassword();
      resetTooltip();
    };

    var setMin = function() {
      var enabledClasses = 0;

      for (var className in WeightedPasswordGen.charClasses) {
        if (WeightedPasswordGen.charClasses[className].enabled) {
          enabledClasses ++;
        }
      }

      // A length of less than 1 is nonsensical
      $scope.min = enabledClasses || 1;

      if ($scope.passwordLength < $scope.min) {
        $scope.value = $scope.min;
      }
    };

    $scope.updateClasses = function() {
      WeightedPasswordGen.charClasses["lowerLetters"].enabled = $scope.includeLower;
      WeightedPasswordGen.charClasses["upperLetters"].enabled = $scope.includeUpper;
      WeightedPasswordGen.charClasses["numbers"].enabled = $scope.includeNumbers;
      WeightedPasswordGen.charClasses["symbols"].enabled = $scope.includeSymbols;

      setMin();
      $scope.generateNewPass();
    };

    $scope.updateLength = function() {
      WeightedPasswordGen.setPasswordLength($scope.passwordLength);
      $scope.generateNewPass();
    };

    // Big ugly hack so the numberpicker isn't too small since it's initially hidden
    $scope.resizeNumberpicker = function() {
      var inputs = document.getElementsByTagName('input');
      for (var i = 0, len = inputs.length; i < len; i++) {
        if (inputs[i].attributes.getNamedItem('resizable-input')) {
          if (inputs[i].style.width == '30px') {
            inputs[i].style.width = '45px';
          }
          break;
        }
      }
    };

    setMin();
    $scope.generateNewPass();

    // Instantiate clipboard.js (https://clipboardjs.com/)
    new Clipboard('#copyPasswordButton');
  }])

  // Directive to select the password text when clicking on it for easier copying
  .directive('selectOnClick', function () {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        element.on('click', function () {
          var selection = window.getSelection();
          var range = document.createRange();
          range.selectNodeContents(this);
          selection.removeAllRanges();
          selection.addRange(range);
        });
      }
    };
  });
