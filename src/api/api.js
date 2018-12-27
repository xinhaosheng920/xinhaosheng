import * as CunZhuangApi from './cunzhuang.api';
import * as ZongJiaoApi from './zongjiao.api';
import * as JianDianApi from './jingdian.api';
import * as ShanFengApi from './shanfeng.api';
import * as YukouApi from './yukou.api';
import * as Constants from '../common/constants';
import * as FaGuiApi from './fagui.api';
import * as JianYiApi from './jianyi.api';
import * as JuBao from './jubao.api';
import * as JIUCUO from './jiucuo.api';
import * as XINZENG from './xinzeng.api';
export default function getApi(name) {
    switch (name) {
        case Constants.CUNZHUANG:
            return CunZhuangApi;
        case Constants.YUKOU:
            return YukouApi;
        case Constants.SHANFENG:
            return ShanFengApi;
        case Constants.JINGDIAN:
            return JianDianApi;
        case Constants.ZONGJIAO:
            return ZongJiaoApi;
        case Constants.FAGUI:
            return FaGuiApi;
        case Constants.JIANYI:
            return JianYiApi;
        case Constants.JUBAO:
            return JuBao;
        case Constants.JIUCUO:
        return JIUCUO;
        case Constants.XINZENG:
        return XINZENG;
    }
}