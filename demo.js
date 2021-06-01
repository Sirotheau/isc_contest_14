var urlParams = new URLSearchParams(window.location.search);

var demoID = urlParams.get('demo_id');
var maxAttempts = 30;
var interval = 2; // seconds

if (!demoID) {
  var regEx = /demo_id=(\d+)$/;
  var match;
  if ((match = regEx.exec(window.location.href)) !== null) {
      demoID = match[1];
  }
}

switch (demoID) {
  case '1':
    demo1(0);
    break;
  case '2':
    demo2(0);
    break;
  case '3':
    demo3(0);
    break;
  case '4':
    demo4(0);
    break;
  case '5':
    demo5(0);
    break;
  case '6':
    demo6(0);
    break;
  case '7':
    demo7(0);
    break;
  case '8':
    demo8(0);
    break;
  default:

}

function demo1(count) {
  setTimeout(function() {
    var element = document.getElementById('authorization-selector');
    var arrowUp = document.getElementById('demo-arrow-up');
    var arrowUpText = document.getElementById('demo-arrow-up-text');
    var arrowUpImage = document.getElementById('demo-arrow-up-image');
    if (element && arrowUp && arrowUpText && arrowUpImage) {
      var rect = element.getBoundingClientRect();
      //console.log(rect.top, rect.right, rect.bottom, rect.left);
      arrowUp.style.top = (rect.bottom + 10) + 'px';
      arrowUp.style.left = ((rect.left + rect.right) / 2 - 100) + 'px';
      arrowUpImage.style.transform = 'rotate(180deg)';
      arrowUpText.innerText = 'API Key and OIDC Supported';
      arrowUp.style.display = 'block';
    } else {
      if (count < maxAttempts) {
        demo1(count + 1);
      }
    }
  }, interval * 1000);
}

function demo2(count) {
  setTimeout(function() {
    var element = document.getElementById('table-rt-patients-search');
    var arrowDown = document.getElementById('demo-arrow-down');
    var arrowDownText = document.getElementById('demo-arrow-down-text');
    var arrowDownImage = document.getElementById('demo-arrow-down-image');
    if (element && arrowDown && arrowDownText && arrowDownImage) {
      var rect = element.getBoundingClientRect();
      //console.log(rect.top, rect.right, rect.bottom, rect.left);
      arrowDown.style.top = (rect.top - 80) + 'px';
      arrowDown.style.left = ((rect.left + rect.right) / 2 - 100) + 'px';
      arrowDownText.innerText = 'Search Field';
      arrowDown.style.display = 'block';
    } else {
      if (count < maxAttempts) {
        demo2(count + 1);
      }
    }
  }, interval * 1000);
}

function demo3(count) {
  setTimeout(function() {
    var element = document.getElementById('table-rt-patients-0-header');
    var arrowDown = document.getElementById('demo-arrow-down');
    var arrowDownText = document.getElementById('demo-arrow-down-text');
    var arrowDownImage = document.getElementById('demo-arrow-down-image');
    if (element && arrowDown && arrowDownText && arrowDownImage) {
      var rect = element.getBoundingClientRect();
      //console.log(rect.top, rect.right, rect.bottom, rect.left);
      arrowDown.style.top = (rect.top - 85) + 'px';
      arrowDown.style.left = ((rect.left + rect.right) / 2 - 138) + 'px';
      arrowDownText.innerText = 'Sortable Fields';
      arrowDown.style.display = 'block';
    } else {
      if (count < maxAttempts) {
        demo3(count + 1);
      }
    }
  }, interval * 1000);
}

function demo4(count) {
  setTimeout(function() {
    var element = document.getElementById('table-rt-patients-pagination');
    var arrowUp = document.getElementById('demo-arrow-up');
    var arrowUpText = document.getElementById('demo-arrow-up-text');
    var arrowUpImage = document.getElementById('demo-arrow-up-image');
    if (element && arrowUp && arrowUpText && arrowUpImage) {
      var rect = element.getBoundingClientRect();
      //console.log(rect.top, rect.right, rect.bottom, rect.left);
      arrowUp.style.top = (rect.bottom + 10) + 'px';
      arrowUp.style.left = ((rect.left + rect.right) / 2 - 100) + 'px';
      arrowUpImage.style.transform = 'rotate(180deg)';
      arrowUpText.innerText = 'Pagination Feature';
      arrowUp.style.display = 'block';
    } else {
      if (count < maxAttempts) {
        demo4(count + 1);
      }
    }
  }, interval * 1000);
}

function demo5(count) {
  setTimeout(function() {
    var element = document.getElementById('rf-patient-related-resources');
    var arrowDown = document.getElementById('demo-arrow-down');
    var arrowDownText = document.getElementById('demo-arrow-down-text');
    var arrowDownImage = document.getElementById('demo-arrow-down-image');
    if (element && arrowDown && arrowDownText && arrowDownImage) {
      var rect = element.getBoundingClientRect();
      //console.log(rect.top, rect.right, rect.bottom, rect.left);
      arrowDown.style.top = (rect.top - 100) + 'px';
      arrowDown.style.left = (rect.left + 75) + 'px';
      arrowDownText.innerText = 'Related Resources';
      arrowDown.style.display = 'block';
    } else {
      if (count < maxAttempts) {
        demo5(count + 1);
      }
    }
  }, interval * 1000);
}

function demo6(count) {
  setTimeout(function() {
    var element = document.getElementById('table-rt-claims-2-header');
    var arrowDown = document.getElementById('demo-arrow-down');
    var arrowDownText = document.getElementById('demo-arrow-down-text');
    var arrowDownImage = document.getElementById('demo-arrow-down-image');
    if (element && arrowDown && arrowDownText && arrowDownImage) {
      var rect = element.getBoundingClientRect();
      //console.log(rect.top, rect.right, rect.bottom, rect.left);
      arrowDown.style.top = (rect.top - 18) + 'px';
      arrowDown.style.left = ((rect.left + rect.right) / 2 - 100) + 'px';
      arrowDownText.innerText = 'Special Reference Field';
      arrowDown.style.display = 'block';
    } else {
      if (count < maxAttempts) {
        demo6(count + 1);
      }
    }
  }, 4 * interval * 1000);
}

function demo7(count) {
  setTimeout(function() {
    var element = document.getElementById('table-rt-conditions-tz-selector');
    var arrowDown = document.getElementById('demo-arrow-down');
    var arrowDownText = document.getElementById('demo-arrow-down-text');
    var arrowDownImage = document.getElementById('demo-arrow-down-image');
    if (element && arrowDown && arrowDownText && arrowDownImage) {
      var rect = element.getBoundingClientRect();
      //console.log(rect.top, rect.right, rect.bottom, rect.left);
      arrowDown.style.top = (rect.top - 95) + 'px';
      arrowDown.style.left = ((rect.left + rect.right) / 2 - 150) + 'px';
      arrowDownText.innerText = 'Data Transformation';
      arrowDown.style.display = 'block';
    } else {
      if (count < maxAttempts) {
        demo7(count + 1);
      }
    }
  }, interval * 1000);
}

function demo8(count) {
  setTimeout(function() {
    var element = document.getElementById('dashboard-chart-1');
    var arrowDown = document.getElementById('demo-arrow-down');
    var arrowDownText = document.getElementById('demo-arrow-down-text');
    var arrowDownImage = document.getElementById('demo-arrow-down-image');
    if (element && arrowDown && arrowDownText && arrowDownImage) {
      var rect = element.getBoundingClientRect();
      //console.log(rect.top, rect.right, rect.bottom, rect.left);
      arrowDown.style.top = (rect.top - 100) + 'px';
      arrowDown.style.left = ((rect.left + rect.right) / 2 - 100) + 'px';
      arrowDownText.innerText = 'Charts & Metrics';
      arrowDown.style.display = 'block';
    } else {
      if (count < maxAttempts) {
        demo8(count + 1);
      }
    }
  }, interval * 1000);
}
