// pathData.js
import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r132/three.module.js';

export const pathData = {
    points: [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, -10),
        new THREE.Vector3(5, 0, -20),
        new THREE.Vector3(-5, 0, -30),
        new THREE.Vector3(0, 0, -40),
        new THREE.Vector3(5, 0, -50),
        new THREE.Vector3(0, 0, -60),
        new THREE.Vector3(-5, 0, -70)
    ],
    nodes: [
        {
            position: new THREE.Vector3(0, 0, 0),
            title: "Personal Statement",
            text: "Jeff Wikstrom\nPhone: (541) 315-1135\nEmail: heffrey78@gmail.com\n\nHighly skilled Senior Software Engineer with a proven track record in leading teams, driving projects to completion, and improving processes through automation. Proficient in backend implementation, service-oriented architectures, cloud orchestration, and CI/CD pipelines."
        },
        {
            position: new THREE.Vector3(0, 0, -10),
            title: "Current Role: Ernst & Young",
            text: "Manager - Senior Software Engineer (2/2022 - present)\n\n• Refocused on individual contribution to pursue platform and AI engineering.\n• Served as the data engineer, working in MS-SQL for the audit of a major state client, resulting in immediate and sweeping positive impacts at the state level.\n• Collaborated internally and across several state agencies to create a formal, Power BI-backed executive dashboard for gubernatorial use and review."
        },
        {
            position: new THREE.Vector3(5, 0, -20),
            title: "Previous Role: Nuvalence, LLC",
            text: "Senior Software Engineer (2/2022 - present)\n\n• Led several teams consulting with clients in the public sector.\n• Owned devops for the team including CI/CD pipeline, Helm and Kubernetes orchestration, GCP environment, and local environment setup and troubleshooting.\n• Consistently delivered on ambitious timelines.\n• Improved processes of existing teams and worked as the engineering lead of a new team, establishing strong norms.\n• Led backend engineering projects (Springboot) including design, coordination, and key implementations.\n• Created utilities and tooling to ease repetitive dev tasks.\n• Collaborated across the company exploring and writing on AI topics for the company blog."
        },
        {
            position: new THREE.Vector3(-5, 0, -30),
            title: "Work History",
            text: "CommerceHub, Inc. (Rithum), Albany, NY\n\n1. Manager, Engineering Success (9/2021 - 2/2022)\n• Created a new department serving a 150-member engineering organization.\n• Led Engineering-wide effort to choose and standardize on a new CI platform.\n• Created training program for AWS SDKs and patterns.\n• Owned engineering wide onboarding efforts.\n\n2. Manager, Software Engineering (3/2021 - 9/2021)\n• Managed software development squad of 6 engineers.\n• Acted as scrum master for a combined team of 14 engineers.\n• Led hiring efforts for the combined team.\n\n3. Lead Software Engineer (9/2019 - 3/2021)\n• Implemented a switch from Kanban to SCRUM for two squads.\n• Led multiple projects to successful completion.\n• Managed a squad of five, hiring three.\n\n4. Software Engineer (4/2018 - 9/2019)\n• Worked on operations and new development of a large legacy ecommerce platform.\n• Rewrote order processing for a major marketplace implementation.\n• Implemented CI/CD pipeline utilizing Gitlab CI, Docker, AWS.\n\nGavant Software, Inc., Troy, NY — Software Engineer (8/2016 - 4/2018)\n\nDST Systems, Inc. (SS&C), Albany, NY — Software Engineer (11/2011 - 8/2016)"
        },
        {
            position: new THREE.Vector3(0, 0, -40),
            title: "Skills & Education",
            text: "Primary Technical Skills:\n• Service oriented architectures\n• GCP\n• GitHub\n• GitLab CI/CD\n• LLM orchestration\n• Backend implementation\n• .NET/MS SQL\n• Java/Springboot\n• Python\n\nEducation:\n• M.Sc. in Software Engineering - Regis University (Graduated with Honors)\n• B.S. in Application Development - Kaplan University (Graduated Summa Cum Laude)"
        },
        {
            position: new THREE.Vector3(5, 0, -50),
            title: "Interests & Volunteering",
            text: "Interests:\nDisc golf, coffee roasting, fitness, gardening, mycology, reading, gaming, running, 3D printing\n\nVolunteering:\n• Junior Achievement instructor\n• SPW Disc Golf Course volunteer\n\nLanguages:\nEnglish (native), Spanish (fluent), German (learning)"
        },
        {
            position: new THREE.Vector3(0, 0, -60),
            title: "Recognition",
            text: "CommerceHub, Albany, NY — 2020 Allstar\nOne of ten individuals recognized in 2020 for outstanding contributions to the company."
        },
        {
            position: new THREE.Vector3(-5, 0, -70),
            title: "Game Center",
            text: "Take a break and play a game! Press Enter to view the game menu and select from the following games:\n\n1. Tetris\n2. [Future Game]\n3. [Future Game]"
        }
    ]
};