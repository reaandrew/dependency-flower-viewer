function Project(name){
    var self = {};

    self.packages = [];
    self.name = name;

    self.addPackage = function (pkg){
        self.packages.push(pkg);
        return self;
    }

    return self;
}

function ViewModel(){
    var self = {};
    self.projects = [];
    self.dependencies = [];

    self.hasDependency = function(dep){
        for (var i = 0 ; i < self.dependencies.length; i++){
            if (self.dependencies[i].name === dep.name) {
                return true;
            }
        }
        return false;
    }

    self.createProject = function(projectName){
        var project = new Project(projectName);
        self.projects.push(project); 

        var chainFunctions = {
            addPackage: function(dep){
                var dependency = {
                    name: dep
                };
                project.addPackage(dependency);
                if (!self.hasDependency(dependency)){
                    self.dependencies.push(dependency);
                }
                return chainFunctions;
            }
        }

        return chainFunctions;
    }

    return self;
}

var module = module || {};
module.exports = module.exports || {};
module.exports.ViewModel = ViewModel;
