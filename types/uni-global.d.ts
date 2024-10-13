export {};

/**
 * uni全局变量/属性/方法 类型声明文件
 */
declare global {
  // 自定义扩展 uni 全局对象
  interface Uni {
    mitter?: Emitter<Events>; // 自定义 mitt 事件总线
    [key: string]: any; // 大范围定义
  }
}
