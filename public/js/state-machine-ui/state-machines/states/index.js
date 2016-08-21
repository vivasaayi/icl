const TabbedNav = require('./../state-machines/tabbed-nav.jsx');
const Form = require('./../state-machines/form.jsx');

const Dashboard = require('./dashboard.jsx');
const generic = require('./generic.jsx');
const FormRenderer = require('./form.jsx');

module.exports = {
  'generic': generic,
  'tabbed-nav': TabbedNav,
  'Dashboard': Dashboard,
  'Form': Form,
  'FormRenderer': FormRenderer
};