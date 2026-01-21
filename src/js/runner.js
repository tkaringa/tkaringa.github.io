class AliyanLang {
    constructor() {
        this.mapping = [
            { word: 'joli', js: 'function' },
            { word: 'thirichu kodu', js: 'return' },
            { word: 'ithu', js: 'let' },
            { word: 'parayeda', js: 'console.log' },
            { word: 'ninnilentha', js: 'if' },
            { word: 'allenkil', js: 'else' },
            { word: 'athey', js: 'true' },
            { word: 'alla', js: 'false' },
            { word: 'pinnem pinnem', js: 'while' },
            { word: 'theernnu', js: 'break' },
            { word: 'onnumilla', js: 'null' },
            { word: 'noki chey', js: 'try' },
            { word: 'pani paali', js: 'catch' }
        ];
    }

    createRegexForWord(word) {
        return new RegExp(`\\b${word}\\b`, 'g');
    }

    translateWord(text, word, jsEquivalent) {
        const regex = this.createRegexForWord(word);
        return text.replace(regex, jsEquivalent);
    }

    transpile(code) {
        if (!code || code.trim().length === 0) {
            throw new Error('No code provided');
        }

        let translated = code;
        
        this.mapping.forEach(({ word, js }) => {
            translated = this.translateWord(translated, word, js);
        });

        return translated;
    }

    executeTranspiledCode(jsCode) {
        const originalLog = console.log;
        const logs = [];
        
        console.log = (...args) => {
            logs.push(args.join(' '));
        };

        try {
            eval(jsCode);
            console.log = originalLog;
            return { success: true, logs };
        } catch (error) {
            console.log = originalLog;
            throw error;
        }
    }

    run(code) {
        try {
            const jsCode = this.transpile(code);
            const result = this.executeTranspiledCode(jsCode);
            return {
                success: true,
                output: result.logs,
                transpiledCode: jsCode
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

class AliyanRunner {
    constructor() {
        this.aliyanLang = new AliyanLang();
        this.codeEditor = document.getElementById('codeEditor');
        this.runButton = document.getElementById('runButton');
        this.clearButton = document.getElementById('clearButton');
        this.outputPane = document.getElementById('output');
        this.clearOutputBtn = document.getElementById('clearOutput');

        this.initEventListeners();
        this.loadExampleCode();
    }

    initEventListeners() {
        this.runButton.addEventListener('click', () => this.runCode());
        this.clearButton.addEventListener('click', () => this.clearCode());
        this.clearOutputBtn.addEventListener('click', () => this.clearOutput());
        this.codeEditor.addEventListener('input', () => this.saveCode());
        
        this.codeEditor.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                e.preventDefault();
                this.runCode();
            }
        });
    }

    getExampleCode() {
        return `joli koottiko(a, b) {
  ithu result = a + b;
  thirichu kodu result;
}

ithu total = koottiko(10, 20);
parayeda("Total ethraya? " + total);

ninnilentha (total > 25) {
  parayeda("Oh! Valya karyam thanne.");
} allenkil {
  parayeda("Ithu njan pratheekshichilla...");
}`;
    }

    loadExampleCode() {
        this.codeEditor.value = this.getExampleCode();
    }

    formatExecutionTime(startTime) {
        const endTime = performance.now();
        const executionTime = (endTime - startTime).toFixed(2);
        return executionTime;
    }

    displaySuccessOutput(result, executionTime) {
        this.addOutput(`Code executed successfully (${executionTime}ms)`, 'success');
        this.addOutput('─'.repeat(50), 'separator');
        
        if (result.output && result.output.length > 0) {
            this.addOutput('Output:', 'header');
            result.output.forEach(line => {
                this.addOutput(line, 'output');
            });
        } else {
            this.addOutput('No output generated', 'info');
        }
        
        this.addOutput('─'.repeat(50), 'separator');
        this.addOutput(`Lines of code: ${this.countCodeLines()}`, 'info');
    }

    displayErrorOutput(error, executionTime) {
        this.addOutput(`Pani Paali aliya! (${executionTime}ms)`, 'error');
        this.addOutput('─'.repeat(50), 'separator');
        this.addOutput(`Error: ${error}`, 'error');
    }

    countCodeLines() {
        const code = this.codeEditor.value.trim();
        return code.split('\n').filter(line => line.trim().length > 0).length;
    }

    runCode() {
        const code = this.codeEditor.value.trim();
        
        if (!code) {
            this.addOutput('No code to run', 'warning');
            return;
        }

        this.clearOutput();
        const startTime = performance.now();
        
        const result = this.aliyanLang.run(code);
        const executionTime = this.formatExecutionTime(startTime);
        
        if (result.success) {
            this.displaySuccessOutput(result, executionTime);
        } else {
            this.displayErrorOutput(result.error, executionTime);
        }
    }

    clearCode() {
        if (confirm('Clear all code? This cannot be undone.')) {
            this.codeEditor.value = '';
            this.clearOutput();
            localStorage.removeItem('aliyan-code');
            this.addOutput('Code cleared', 'info');
        }
    }

    clearOutput() {
        this.outputPane.innerHTML = '';
    }

    addOutput(message, type = 'info') {
        const line = document.createElement('div');
        line.className = `output-line output-${type}`;
        line.textContent = message;
        this.outputPane.appendChild(line);
        this.scrollOutputToBottom();
    }

    scrollOutputToBottom() {
        this.outputPane.scrollTop = this.outputPane.scrollHeight;
    }

    saveCode() {
        localStorage.setItem('aliyan-code', this.codeEditor.value);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AliyanRunner();
});