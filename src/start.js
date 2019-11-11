//var XLSX = require('xlsx')
var fs = require('fs')

function getDataFromExcelFile(pathToExcelFile) {
    var buf = fs.readFileSync(pathToExcelFile);
    var table = XLSX.read(buf, {
        type: 'buffer'
    });

    const sheet = table.Sheets[table.SheetNames[0]];
    const sheetAsJSON = XLSX.utils.sheet_to_json(sheet);
    console.log('sheetAsJSON:', sheetAsJSON);

    const skillNumbers = new Set();
    const skillsToGrades = new Map();

    sheetAsJSON.forEach((row) => {
        skillNumbers.add(row.Skill_Number);
    });

    skillNumbers.forEach((skillNumber) => {

        const rowsForSkill = sheetAsJSON.filter((row) => {
            return row.Skill_Number == skillNumber
        })

        const gradeNames = rowsForSkill.map((row) => {
            return row.GradeName
        });

        skillsToGrades.set(skillNumber, gradeNames);
    });


    //   { Subject: 'ELA', Skill_Number: 'ela-1203', GradeName: 3 }
    fs.writeFileSync('./out/skillToGrade.json', JSON.stringify(skillsToGrades), 'utf-8');
}

function mapGradesToSkills() {
    const pathToMapping = './res/skillToGrade.json'
    const pathToData = './res/dbData.json';

    const mapping = JSON.parse(fs.readFileSync(pathToMapping));
    const skills = JSON.parse(fs.readFileSync(pathToData));

    const output = [];

    skills.forEach(skill => {
        const match = mapping.find((elem) => {
            return skill.skillId === elem.Skill_Number;
        });

        skill.grades = []
        skill.grades.push(JSON.stringify(match.GradeName));

        output.push(skill);
        const parsedOut = JSON.stringify(output, null, 4);
        // console.log('parsedOut: ', parsedOut);
        fs.writeFileSync('./out/updatedSkills.json', parsedOut, 'utf-8');
    });
}


mapGradesToSkills();