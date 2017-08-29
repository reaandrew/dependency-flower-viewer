var should = require('should');
var ViewModel = require('../public/js/view-model').ViewModel;

describe('ViewModel', () => {
    
    it('Create a project with dependencies', () => {
        var viewModel = new ViewModel();
        viewModel.createProject('My New Project').addPackage('pkg1').addPackage('pkg2')
        should(viewModel.dependencies).eql(['pkg1', 'pkg2']); 
    });

    it('Dedups depdencies', () => {
        var viewModel = new ViewModel();
        viewModel.createProject('Project 1').addPackage('pkg1').addPackage('pkg2')
        viewModel.createProject('Project 2').addPackage('pkg1').addPackage('pkg2')
        should(viewModel.dependencies).eql(['pkg1', 'pkg2']); 
    });

});
