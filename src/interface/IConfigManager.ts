export default interface IConfigManager {
    getValue(name: string): any;
    setValue(name: string, value: any): void;
}
