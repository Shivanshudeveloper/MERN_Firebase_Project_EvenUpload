$(() => {
    $("#photoModel").click(() => {
        $('#photoModelFiles')
        .modal('show')
        ;
    });

    $("#pdfModel").click(() => {
        $('#pdfModelFiles')
        .modal('show')
        ;
    });

    $("#docsModel").click(() => {
        $('#docsModelFiles')
        .modal('show')
        ;
    });

    $("#excelModel").click(() => {
        $('#excelModelFiles')
        .modal('show')
        ;
    });

    $("#zipModel").click(() => {
        $('#zipModelFiles')
        .modal('show')
        ;
    });

    // Create a new project
    $("#createNewProjectBtn").click(() => {
        $('#createNewProjectModel')
        .modal('show')
        ;
    });

    // Share Project
    // Create a new project
    $("#shareProjectModelBtn").click(() => {
        $('#shareProjectModel')
        .modal('show')
        ;
    });

    // Create a new folder
    $("#createFolderBtn").click(() => {
        $('#createFolderModel')
        .modal('show')
        ;
    });

    // Share folder
    $("#shareFolderBtn").click(() => {
        $('#shareFolderModel')
        .modal('show')
        ;
    });

    // Add Note
    $("#addNoteBtn").click(() => {
        $('#addNoteModel')
        .modal('show')
        ;
    });

    $('#sidebarBtn').click(() => {
        $('.ui.sidebar')
        .sidebar('toggle')
        ;
    })
    

})