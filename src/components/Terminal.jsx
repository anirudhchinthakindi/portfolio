import React, { useState, useEffect, useRef } from 'react';
import Output from './Output';
import { resumeData } from '../data/resume';

const Terminal = ({ onSwitchToGUI }) => {
    const [input, setInput] = useState('');
    const [currentPath, setCurrentPath] = useState(['~']);
    const [output, setOutput] = useState([
        {
            type: 'ascii', content: `
  ___        _                _ _       _____ _     _       _   _           _    _           _ _ 
 / _ \\      (_)              | | |     /  __ \\ |   (_)     | | | |         | |  (_)         | (_)
/ /_\\ \\_ __  _ _ __ _   _  __| | |__   | /  \\/ |__  _ _ __ | |_| |__   __ _| | ___ _ __   __| |_ 
|  _  | '_ \\| | '__| | | |/ _\` | '_ \\  | |   | '_ \\| | '_ \\| __| '_ \\ / _\` | |/ / | '_ \\ / _\` | |
| | | | | | | | |  | |_| | (_| | | | | | \\__/\\ | | | | | | | |_| | | | (_| |   <| | | | | (_| | |
\\_| |_/_| |_|_|_|   \\__,_|\\__,_|_| |_|  \\____/_| |_|_|_| |_|\\__|_| |_|\\__,_|_|\\_\\_|_| |_|\\__,_|_|                                                                
                                                                                                 ` },
        {
            type: 'welcome', content: `Welcome to Anirudh's Portfolio v18.4.0
Type 'help' to see available commands. Type 'gui' to switch to the main website.`
        }
    ]);
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [justCleared, setJustCleared] = useState(false);
    const inputRef = useRef(null);
    const bottomRef = useRef(null);

    const prompt = `guest@anirudhs-portfolio:${currentPath.join('/')}$`;

    // File System Structure
    const fileSystem = {
        '~': {
            'about.txt': { type: 'file', content: `Name: ${resumeData.name}\nLocation: ${resumeData.contact.location}\n\nI’m an undergraduate student at the University of Virginia majoring in Neuroscience on the pre-med track and a researcher at the Kapur Lab at UVA Health and at the Department for Neuropsychiatry and Neuromodulation at MGH, focused on translational neuroimaging and electrophysiology. I combine hands-on lab work with computational tools to study epilepsy and neurodegeneration. Focused on collaborating with others, I'm passionate about pursuing a career in neurosurgery, and aiming to advance the communities of which I am a part of. Feel free to reach out!` },
            'skills.txt': {
                type: 'file', content: Object.entries(resumeData.skills).map(([cat, skills]) =>
                    `${cat}:\n  ${skills.join(', ')}`
                ).join('\n\n')
            },
            'contact.txt': { type: 'file', content: `Email: ${resumeData.contact.email}\nLinkedIn: ${resumeData.contact.linkedin}\nLocation: ${resumeData.contact.location}` },
            'experience': {
                type: 'dir',
                children: {
                    'education.txt': {
                        type: 'file', content: resumeData.education.map(edu =>
                            `[${edu.date}] ${edu.school}\n  ${edu.degree}\n  ${edu.details}`
                        ).join('\n\n')
                    },
                    'research.txt': {
                        type: 'file', content: resumeData.research.map(res =>
                            `[${res.date}] ${res.role} @ ${res.lab}\n  ${res.details.join('\n  ')}`
                        ).join('\n\n')
                    },
                    'leadership.txt': {
                        type: 'file', content: resumeData.leadership.map(item => {
                            if (item.roles) {
                                const rolesText = item.roles.map(r =>
                                    `  - ${r.role} (${r.date})\n    ${r.details}`
                                ).join('\n');
                                return `${item.organization} [${item.location}]\n${rolesText}`;
                            }
                            return `[${item.date}] ${item.role} @ ${item.organization}\n  ${item.details}`;
                        }).join('\n\n')
                    },
                    'volunteering.txt': {
                        type: 'file', content: resumeData.volunteering.map(role =>
                            `[${role.date}] ${role.role} @ ${role.organization}\n  ${role.details}`
                        ).join('\n\n')
                    },
                    'work.txt': {
                        type: 'file', content: resumeData.work.map(job =>
                            `[${job.date}] ${job.role} @ ${job.organization}\n  ${job.details}`
                        ).join('\n\n')
                    },
                    'awards.txt': {
                        type: 'file',
                        content: resumeData.awards.map(award =>
                            award.description
                                ? `${award.name}\n  - ${award.description}`
                                : award.name
                        ).join('\n\n')
                    },
                }
            },
            'gallery': {
                type: 'dir',
                children: resumeData.gallery.reduce((acc, item) => {
                    acc[`${item.id}.txt`] = {
                        type: 'file',
                        content: `[IMAGE] ${item.title}\n${item.description}\n\n(Type "gui" to view image)`
                    };
                    return acc;
                }, {})
            }
        }
    };

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    useEffect(() => {
        if (justCleared) {
            // Scroll to position input at top of viewport after clear
            const inputArea = document.querySelector('.input-area');
            if (inputArea) {
                inputArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        } else {
            // Normal scroll to bottom
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [output, justCleared]);

    const getCurrentDir = () => {
        let current = fileSystem['~'];
        for (let i = 1; i < currentPath.length; i++) {
            const nextKey = currentPath[i];
            if (current[nextKey] && current[nextKey].children) {
                current = current[nextKey].children;
            } else if (current.children && current.children[nextKey]) {
                current = current.children[nextKey];
                if (current.children) {
                    current = current.children;
                }
            }
        }
        return current;
    };

    const handleCommand = (cmd) => {
        const newOutput = [...output, { type: 'command', content: cmd, prompt }];
        const trimmedCmd = cmd.trim();
        const parts = trimmedCmd.split(/\s+/);
        const command = parts[0].toLowerCase();
        const args = parts.slice(1);

        const currentDir = getCurrentDir();

        switch (command) {
            case 'help':
                newOutput.push({
                    type: 'text', content: `ls          - List directory contents
cd <dir>    - Change directory
cat <file>  - View file content
gui         - Switch to GUI mode
clear       - Clear terminal
help        - Show this help message`
                });
                break;
            case 'ls':
                const allItems = Object.keys(currentDir.children || currentDir).filter(k => k !== 'type' && k !== 'children');
                const dirs = allItems.filter(k => {
                    const item = (currentDir.children || currentDir)[k];
                    return item && item.type === 'dir';
                }).sort();
                const files = allItems.filter(k => {
                    const item = (currentDir.children || currentDir)[k];
                    return !item || item.type === 'file';
                }).sort();
                const sortedContents = [...dirs, ...files];
                newOutput.push({ type: 'text', content: sortedContents.join('  ') });
                break;
            case 'cd':
                if (args.length === 0) {
                    setCurrentPath(['~']);
                } else if (args[0] === '..') {
                    if (currentPath.length > 1) {
                        setCurrentPath(prev => prev.slice(0, -1));
                    }
                } else {
                    const target = args[0];
                    const dir = (currentDir.children || currentDir)[target];
                    if (dir && dir.type === 'dir') {
                        setCurrentPath(prev => [...prev, target]);
                    } else if (dir) {
                        newOutput.push({ type: 'error', content: `cd: not a directory: ${target}` });
                    } else {
                        newOutput.push({ type: 'error', content: `cd: no such file or directory: ${target}` });
                    }
                }
                break;
            case 'gui':
                newOutput.push({ type: 'text', content: 'Switching to GUI mode...' });
                setTimeout(onSwitchToGUI, 250);
                break;
            case 'clear':
                // Show the command, then flag that we just cleared
                setJustCleared(true);
                break;
            case '':
                break;
            default:
                // Try to treat command as a file name (implicit cat)
                const file = (currentDir.children || currentDir)[trimmedCmd];
                if (file) {
                    if (file.type === 'file') {
                        newOutput.push({ type: 'text', content: file.content });
                    } else {
                        newOutput.push({ type: 'text', content: `${trimmedCmd}: Is a directory` });
                    }
                } else if (command === 'cat' && args.length > 0) {
                    const targetFile = (currentDir.children || currentDir)[args[0]];
                    if (targetFile && targetFile.type === 'file') {
                        newOutput.push({ type: 'text', content: targetFile.content });
                    } else {
                        newOutput.push({ type: 'error', content: `cat: ${args[0]}: No such file or directory` });
                    }
                } else {
                    newOutput.push({ type: 'error', content: `Command not found: ${cmd}. Type 'help' for available commands.` });
                }
        }

        setOutput(newOutput);
        setHistory([...history, cmd]);
        setHistoryIndex(-1);
        setInput('');

        // Reset justCleared flag after any non-clear command
        if (command !== 'clear') {
            setJustCleared(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleCommand(input);
        } else if (e.key === 'ArrowUp') {
            if (history.length > 0) {
                const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
                setHistoryIndex(newIndex);
                setInput(history[newIndex]);
                // Move cursor to end after state updates
                setTimeout(() => {
                    if (inputRef.current) {
                        const length = history[newIndex].length;
                        inputRef.current.setSelectionRange(length, length);
                    }
                }, 0);
            }
        } else if (e.key === 'ArrowDown') {
            if (historyIndex !== -1) {
                const newIndex = Math.min(history.length - 1, historyIndex + 1);
                setHistoryIndex(newIndex);
                setInput(history[newIndex]);
                // Move cursor to end after state updates
                setTimeout(() => {
                    if (inputRef.current) {
                        const length = history[newIndex].length;
                        inputRef.current.setSelectionRange(length, length);
                    }
                }, 0);
                if (historyIndex === history.length - 1) {
                    setHistoryIndex(-1);
                    setInput('');
                }
            }
        }
    };

    const handleContainerClick = () => {
        const selection = window.getSelection();
        if (selection.toString().length === 0) {
            inputRef.current?.focus({ preventScroll: true });
        }
    };

    return (
        <div className="terminal-wrapper" onClick={handleContainerClick}>
            <Output output={output} />
            <div className="input-area">
                <span className="prompt-label">{prompt}</span>
                <input
                    ref={inputRef}
                    type="text"
                    className="terminal-input"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                />
            </div>
            {justCleared && <div style={{ height: '85vh' }}></div>}
            <div ref={bottomRef} />
        </div>
    );
};

export default Terminal;
