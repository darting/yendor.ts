
    export interface ITestClass {

    }

    export class Test {
        private static PROP_SETUP: string = "setUp";
        private static PROP_TEARDOWN: string = "tearDown";
        private tests: TestDefintion[] = [];
        private testClass: TestClass = new TestClass();

        public addTestClass(testClass: ITestClass, name: string = "Tests", clazz: any): void {
            this.tests.push(new TestDefintion(testClass, name, clazz));
        }

        public isReservedFunctionName(functionName: string): boolean {
            if (functionName.indexOf("_") === 0) {
                return true;
            }
            if ( functionName === "constructor") {
                return true;
            }
            for (let prop in this.testClass) {
                if (prop === functionName) {
                    return true;
                }
            }
            return false;
        }

        public run() {
            let testContext = new TestContext();
            let testResult = new TestResult();

            for (let test of this.tests) {
                let testClass = test.testClass;
                let testName = test.name;
                console.log("running " + testName);
                for (let prop of Object.getOwnPropertyNames(test.clazz.prototype)) {
                    if (!this.isReservedFunctionName(prop) && prop.indexOf("__") !== 0) {
                        if (typeof (<any> testClass)[prop] === "function") {
                            console.log("=> " + prop);
                            if (typeof (<any> testClass)[Test.PROP_SETUP] === "function") {
                                (<any> testClass)[Test.PROP_SETUP]();
                            }
                            try {
                                (<any> testClass)[prop](testContext);
                                testResult.passes.push(new TestDescription(testName, prop, "OK"));
                            } catch (err) {
                                console.log(err);
                                testResult.errors.push(new TestDescription(testName, prop, err));
                            }
                            if (typeof (<any> testClass)[Test.PROP_TEARDOWN] === "function") {
                                (<any> testClass)[Test.PROP_TEARDOWN]();
                            }
                        }
                    }
                }
            }

            return testResult;
        }

        public showResultsBrowser(target: HTMLElement, result: TestResult) {
            let template = "<article>" +
                "<h1>" + this.getTestResult(result) + "</h1>" +
                "<p>" + this.getTestSummary(result) + "</p>" +
                "<section id='tsFail'>" +
                "<h2>Errors</h2>" +
                "<ul class='bad'>" + this.getTestResultList(result.errors) + "</ul>" +
                "</section>" +
                "<section id='tsOkay'>" +
                "<h2>Passing Tests</h2>" +
                "<ul class='good'>" + this.getTestResultList(result.passes) + "</ul>" +
                "</section>" +
                "</article>";

            target.innerHTML = template;
        }

        public showResultsNode(result: TestResult) {
            console.log(this.getTestResultListNode(result.passes));
            console.log(this.getTestResultListNode(result.errors));
            console.log("Total tests : " + (result.passes.length + result.errors.length));
            console.log("Passed tests : " + result.passes.length );
            console.log("Failed tests : " + result.errors.length);
            console.log(this.getTestResult(result));
        }

        private getTestResult(result: TestResult) {
            return result.errors.length === 0 ? "SUCCESS" : "FAILURE";
        }

        private getTestSummary(result: TestResult) {
            return "Total tests: <span id='tsUnitTotalCout'>" + (result.passes.length
                + result.errors.length).toString() + "</span>. " +
                "Passed tests: <span id='tsUnitPassCount' class='good'>" + result.passes.length + "</span>. " +
                "Failed tests: <span id='tsUnitFailCount' class='bad'>" + result.errors.length + "</span>.";
        }
        private getTestResultListNode(testResults: TestDescription[]) {
            let list = "";
            let group = "";
            let isFirst = true;
            for (let result of testResults) {
                if (result.testName !== group) {
                    group = result.testName;
                    if (isFirst) {
                        isFirst = false;
                    }
                    list += result.testName + "\n";
                }
                list += "\t" + result.funcName + "(): " + result.message + "\n";
            }
            return list;
        }
        private getTestResultList(testResults: TestDescription[]) {
            let list = "";
            let group = "";
            let isFirst = true;
            for (let result of testResults) {
                if (result.testName !== group) {
                    group = result.testName;
                    if (isFirst) {
                        isFirst = false;
                    } else {
                        list += "</li></ul>";
                    }
                    list += "<li>" + result.testName + "<ul>";
                }
                list += "<li>" + result.funcName + "(): " + result.message + "</li>";
            }
            return list + "</ul>";
        }

    }

    export class TestContext {
        public setUp() {
        }

        public tearDown() {
        }

        public areIdentical(a: any, b: any, msg?: string): void {
            if (a !== b) {
                throw (msg ? msg : "") +
                " {" + (typeof a) + "} '" + a + "' instead of " +
                "{" + (typeof b) + "} '" + b + "'";
            }
        }

        public areNotIdentical(a: any, b: any): void {
            if (a === b) {
                throw "areNotIdentical failed when passed " +
                "{" + (typeof a) + "} '" + a + "' and " +
                "{" + (typeof b) + "} '" + b + "'";
            }
        }

        public isTrue(a: boolean, msg?: string) {
            if (!a) {
                throw msg ? msg : "failed assertion";
            }
        }

        public isFalse(a: boolean, msg?: string) {
            if (a) {
                throw msg ? msg : "failed assertion";
            }
        }

        public isTruthy(a: any) {
            if (!a) {
                throw "isTrue failed when passed " +
                "{" + (typeof a) + "} '" + a + "'";
            }
        }

        public isFalsey(a: any) {
            if (a) {
                throw "isFalse failed when passed " +
                "{" + (typeof a) + "} '" + a + "'";
            }
        }

        public throws(a: { (): void; }) {
            let isThrown = false;
            try {
                a();
            } catch (ex) {
                isThrown = true;
            }
            if (!isThrown) {
                throw "did not throw an error";
            }
        }

        public fail() {
            throw "fail";
        }
    }

    export class TestClass extends TestContext {

    }

    export class FakeFunction {
        constructor(public name: string, public delgate: { (...args: any[]): any; }) {
        }
    }

    export class Fake {
        constructor(obj: any) {
            for (let prop in obj) {
                if (typeof obj[prop] === "function") {
                    (<any> this)[prop] = function() { };
                } else {
                    (<any> this)[prop] = null;
                }
            }
        }

        public create(): any {
            return this;
        }

        public addFunction(name: string, delegate: { (...args: any[]): any; }) {
            (<any> this)[name] = delegate;
        }

        public addProperty(name: string, value: any) {
            (<any> this)[name] = value;
        }
    }

    class TestDefintion {
        constructor(public testClass: ITestClass, public name: string, public clazz: any) {
        }
    }

    export class TestDescription {
        constructor(public testName: string, public funcName: string, public message: string) {
        }
    }

    export class TestResult {
        public passes: TestDescription[] = [];
        public errors: TestDescription[] = [];
    }
