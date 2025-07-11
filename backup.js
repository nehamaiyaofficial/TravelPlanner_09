
javascript
const fs = require('fs');
const path = require('path');

class BackupRestore {
    constructor() {
        this.dataFolder = path.join(__dirname, '../json-storage');
        this.backupFolder = path.join(__dirname, 'backups');
        
        // Create backup folder if it doesn't exist
        if (!fs.existsSync(this.backupFolder)) {
            fs.mkdirSync(this.backupFolder);

        try {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const backupName = `backup-${timestamp}`;
            const backupPath = path.join(this.backupFolder, backupName);
            
            // Create backup folder
            fs.mkdirSync(backupPath);
            
            // List of files to backup
            const filesToBackup = ['places.json', 'trips.json', 'users.json'];
            
            filesToBackup.forEach(filename => {
                const sourcePath = path.join(this.dataFolder, filename);
                const backupFilePath = path.join(backupPath, filename);
                
                if (fs.existsSync(sourcePath)) {
                    fs.copyFileSync(sourcePath, backupFilePath);
                    console.log(`✓ Backed up ${filename}`);
                } else {
                    console.log(`⚠ Warning: ${filename} not found`);
                }
            });
            const backupInfo = {
                created: new Date().toISOString(),
                files: filesToBackup,
                note: 'Automatic backup of travel planner data'
            };
            
            fs.writeFileSync(
                path.join(backupPath, 'backup-info.json'),
                JSON.stringify(backupInfo, null, 2)
            );
            
            console.log(`✅ Backup created successfully: ${backupName}`);            return backupName;
            
        } catch (error) {
            console.error('❌ Backup failed:', error.message);

    listBackups() {
        try {
            const backups = fs.readdirSync(this.backupFolder)
                .filter(item => {
                    const itemPath = path.join(this.backupFolder, item);
                    return fs.statSync(itemPath).isDirectory();
                })
                .map(backupName => {
                    const infoPath = path.join(this.backupFolder, backupName, 'backup-info.json');
                    let info = { created: 'Unknown' };
                    
                    if (fs.existsSync(infoPath)) {
                        info = JSON.parse(fs.readFileSync(infoPath, 'utf8'));
                    }
                    
                    return {
                        name: backupName,
                        created: info.created,
                        note: info.note || 'No description'
                    };
                });

            return backups.sort((a, b) => new Date(b.created) - new Date(a.created));
            
        } catch (error) {
            console.error('❌ Failed to list backups:', error.message);
            return [];
        }
    }

    // Restore from backup
    restoreBackup(backupName) {
        try {
            const backupPath = path.join(this.backupFolder, backupName);
            
            if (!fs.existsSync(backupPath)) {
                throw new Error(`Backup "${backupName}" not found`);
            }
            
            // Files to restore
            const filesToRestore = ['places.json', 'trips.json', 'users.json'];
            
            filesToRestore.forEach(filename => {
                const backupFilePath = path.join(backupPath, filename);
                const restorePath = path.join(this.dataFolder, filename);
                
                if (fs.existsSync(backupFilePath)) {
                    fs.copyFileSync(backupFilePath, restorePath);
                    console.log(`✓ Restored ${filename}`);
                } else {
                    console.log(`⚠ Warning: ${filename} not found in backup`);
                }
            });
            
            console.log(`✅ Restore completed from: ${backupName}`);
            
        } catch (error) {
            console.error('❌ Restore failed:', error.message);

            throw error;

        }
    }



    // Delete old backups (keep only latest 5)
    cleanupOldBackups() {
        try {
            const backups = this.listBackups();
            
            if (backups.length > 5) {
                const backupsToDelete = backups.slice(5); // Keep first 5, delete rest
                
                backupsToDelete.forEach(backup => {
                    const backupPath = path.join(this.backupFolder, backup.name);
                    fs.rmSync(backupPath, { recursive: true });
                    console.log(`🗑 Deleted old backup: ${backup.name}`);
                });
                
                console.log(`✅ Cleanup completed. Kept ${Math.min(5, backups.length)} backups.`);
            } else {
                console.log('✅ No cleanup needed. Less than 5 backups exist.');
            }
            
        } catch (error) {
            console.error('❌ Cleanup failed:', error.message);
        }
    }
OB}
OB
// Example usage
if (require.main === module) {
    const backup = new BackupRestore();
    
OB    // Show menu
    const args = process.argv.slice(2);
OB    const command = args[0];
OB    
    switch (command) {
        case 'create':
OBOB            backup.createBackup();
            break;
OB            
        case 'list':
            const backups = backup.listBackups();
            console.log('\n📋 Available Backups:');
            backups.forEach((b, index) => {
                console.log(`${index + 1}. ${b.name}`);
                console.log(`   Created: ${new Date(b.created).toLocaleString()}`);
OAOAOAOA                console.log(`   Note: ${b.note}\n`);
            });
            break;
            
OB        case 'restore':
            const backupName = args[1];
            if (!backupName) {
                console.log('❌ Please specify backup name: node backup.js restore backup-name');
            } else {
                backup.restoreBackup(backupName);
            }
            break;
            
        case 'cleanup':
            backup.cleanupOldBackups();
            break;
            
        default:
            console.log(`
🛠 Travel Planner Backup Tool

Usage:
  node backup.js create          - Create new backup
  node backup.js list            - List all backups  
  node backup.js restore <name>  - Restore from backup
  node backup.js cleanup         - Delete old backups

Examples:
  node backup.js create
  node backup.js restore backup-2024-03-15T10-30-00-000Z
            `);
    }
}

module.exports = BackupRestore;


### simple-backup.js
javascript
// Simple version for beginners
const fs = require('fs');

function simpleBackup() {
    const today = new Date().toISOString().split('T')[0]; // Get date like 2024-03-15
    
    try {
        // Read the original files
        const places = fs.readFileSync('../json-storage/places.json', 'utf8');
        const trips = fs.readFileSync('../json-storage/trips.json', 'utf8');
        const users = fs.readFileSync('../json-storage/users.json', 'utf8');
        
        // Save backup files with date
        fs.writeFileSync(`places-backup-${today}.json`, places);
        fs.writeFileSync(`trips-backup-${today}.json`, trips);
        fs.writeFileSync(`users-backup-${today}.json`, users);
        
        console.log('✅ Backup created successfully!');
        console.log(`Files saved with date: ${today}`);
        
    } catch (error) {
        console.log('❌ Backup failed:', error.message);
    }
}

function simpleRestore(date) {
    try {
        // Read the backup files
        const places = fs.readFileSync(`places-backup-${date}.json`, 'utf8');
        const trips = fs.readFileSync(`trips-backup-${date}.json`, 'utf8');
        const users = fs.readFileSync(`users-backup-${date}.json`, 'utf8');
        
        // Restore to original location
        fs.writeFileSync('../json-storage/places.json', places);
        fs.writeFileSync('../json-storage/trips.json', trips);
        fs.writeFileSync('../json-storage/users.json', users);
        
        console.log('✅ Files restored successfully!');
        console.log(`Restored from date: ${date}`);
        
    } catch (error) {
        console.log('❌ Restore failed:', error.message);
        console.log('Make sure backup files exist for that date');
    }
}

// Check what the user wants to do
const command = process.argv[2];
const date = process.argv[3];

if (command === 'backup') {
    simpleBackup();
} else if (command === 'restore' && date) {
    simpleRestore(date);
} else {
    console.log(`
Simple Backup Tool

To create backup:
  node simple-backup.js backup

To restore backup:
  node simple-backup.js restore 2024-03-15

This will create files like:
- places-backup-2024-03-15.json
- trips-backup-2024-03-15.json  
- users-backup-2024-03-15.json
    `)
