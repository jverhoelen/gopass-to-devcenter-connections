const extendDirectoryObject = (directory, folderPathArray) => {
    for (let i = 0; i < folderPathArray.length; i++) {
        const previousFolders =  i == 0 ? [] : folderPathArray.slice(0, i)
        
        let subfolder = directory
        for (const prevFolder of previousFolders) {
            subfolder = subfolder[prevFolder] 
        }
        
        const currentFolder = folderPathArray[i]
        if (!subfolder[currentFolder]) {
            subfolder[currentFolder] = {}
        }
    }

    return directory
}

module.exports = extendDirectoryObject
