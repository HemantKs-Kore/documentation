import { Component, OnInit, ViewChild, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { ServiceInvokerService } from '@kore.services/service-invoker.service';
import { NotificationService } from '@kore.services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { KRModalComponent } from 'src/app/shared/kr-modal/kr-modal.component';
import { WorkflowService } from '@kore.services/workflow.service';
import { AppSelectionService } from '@kore.services/app.selection.service';
import { AuthService } from '@kore.services/auth.service';
import { DomSanitizer } from '@angular/platform-browser';
import { PerfectScrollbarComponent } from 'ngx-perfect-scrollbar';
import { LocalStoreService } from '@kore.services/localstore.service';
import * as FileSaver from 'file-saver';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
declare const $: any;
@Component({
  selector: 'app-upgrade-plan',
  templateUrl: './upgrade-plan.component.html',
  styleUrls: ['./upgrade-plan.component.scss']
})
export class UpgradePlanComponent implements OnInit, OnDestroy {
  addOverageModalPopRef: any;
  choosePlanModalPopRef: any;
  paymentGatewayModelPopRef: any;
  contactusModelPopRef: any;
  contactusSuccessModelPopRef: any;
  changePlanModelPopRef: any;
  confirmUpgradeModelPopRef: any;
  validations:boolean = false;
  search_country = '';
   countriesList = [
  {
    name: 'Afghanistan',
    code: 'AF',
    timezone: 'Afghanistan Standard Time',
    utc: 'UTC+04:30',
    mobileCode: '+93',
  },
  {
    name: 'Åland Islands',
    code: 'AX',
    timezone: 'FLE Standard Time',
    utc: 'UTC+02:00',
    mobileCode: '+358-18',
  },
  {
    name: 'Albania',
    code: 'AL',
    timezone: 'Central Europe Standard Time',
    utc: 'UTC+01:00',
    mobileCode: '+355',
  },
  {
    name: 'Algeria',
    code: 'DZ',
    timezone: 'W. Central Africa Standard Time',
    utc: 'UTC+01:00',
    mobileCode: '+213',
  },
  {
    name: 'American Samoa',
    code: 'AS',
    timezone: 'UTC-11',
    utc: 'UTC-11:00',
    mobileCode: '+1-684',
  },
  {
    name: 'Andorra',
    code: 'AD',
    timezone: 'W. Europe Standard Time',
    utc: 'UTC+01:00',
    mobileCode: '+376',
  },
  {
    name: 'Angola',
    code: 'AO',
    timezone: 'W. Central Africa Standard Time',
    utc: 'UTC+01:00',
    mobileCode: '+244',
  },
  {
    name: 'Anguilla',
    code: 'AI',
    timezone: 'SA Western Standard Time',
    utc: 'UTC-04:00',
    mobileCode: '+1-264',
  },
  {
    name: 'Antarctica',
    code: 'AQ',
    timezone: 'Pacific SA Standard Time',
    utc: 'UTC-03:00',
    mobileCode: '+',
  },
  {
    name: 'Antigua and Barbuda',
    code: 'AG',
    timezone: 'SA Western Standard Time',
    utc: 'UTC-04:00',
    mobileCode: '+1-268',
  },
  {
    name: 'Argentina',
    code: 'AR',
    timezone: 'Argentina Standard Time',
    utc: 'UTC-03:00',
    mobileCode: '+54',
  },
  {
    name: 'Armenia',
    code: 'AM',
    timezone: 'Caucasus Standard Time',
    utc: 'UTC+04:00',
    mobileCode: '+374',
  },
  {
    name: 'Aruba',
    code: 'AW',
    timezone: 'SA Western Standard Time',
    utc: 'UTC-04:00',
    mobileCode: '+297',
  },
  {
    name: 'Australia',
    code: 'AU',
    timezone: 'AUS Eastern Standard Time',
    utc: 'UTC+10:00',
    mobileCode: '+61',
  },
  {
    name: 'Austria',
    code: 'AT',
    timezone: 'W. Europe Standard Time',
    utc: 'UTC+01:00',
    mobileCode: '+43',
  },
  {
    name: 'Azerbaijan',
    code: 'AZ',
    timezone: 'Azerbaijan Standard Time',
    utc: 'UTC+04:00',
    mobileCode: '+994',
  },
  {
    name: 'Bahamas, The',
    code: 'BS',
    timezone: 'Eastern Standard Time',
    utc: 'UTC-05:00',
    mobileCode: '+1-242',
  },
  {
    name: 'Bahrain',
    code: 'BH',
    timezone: 'Arab Standard Time',
    utc: 'UTC+03:00',
    mobileCode: '+973',
  },
  {
    name: 'Bangladesh',
    code: 'BD',
    timezone: 'Bangladesh Standard Time',
    utc: 'UTC+06:00',
    mobileCode: '+880',
  },
  {
    name: 'Barbados',
    code: 'BB',
    timezone: 'SA Western Standard Time',
    utc: 'UTC-04:00',
    mobileCode: '+1-246',
  },
  {
    name: 'Belarus',
    code: 'BY',
    timezone: 'Belarus Standard Time',
    utc: 'UTC+03:00',
    mobileCode: '+375',
  },
  {
    name: 'Belgium',
    code: 'BE',
    timezone: 'Romance Standard Time',
    utc: 'UTC+01:00',
    mobileCode: '+32',
  },
  {
    name: 'Belize',
    code: 'BZ',
    timezone: 'Central America Standard Time',
    utc: 'UTC-06:00',
    mobileCode: '+501',
  },
  {
    name: 'Benin',
    code: 'BJ',
    timezone: 'W. Central Africa Standard Time',
    utc: 'UTC+01:00',
    mobileCode: '+229',
  },
  {
    name: 'Bermuda',
    code: 'BM',
    timezone: 'Atlantic Standard Time',
    utc: 'UTC-04:00',
    mobileCode: '+1-441',
  },
  {
    name: 'Bhutan',
    code: 'BT',
    timezone: 'Bangladesh Standard Time',
    utc: 'UTC+06:00',
    mobileCode: '+975',
  },
  {
    name: 'Bolivarian Republic of Venezuela',
    code: 'VE',
    timezone: 'Venezuela Standard Time',
    utc: 'UTC-04:30',
    mobileCode: '+58',
  },
  {
    name: 'Bolivia',
    code: 'BO',
    timezone: 'SA Western Standard Time',
    utc: 'UTC-04:00',
    mobileCode: '+591',
  },
  {
    name: 'Bonaire, Sint Eustatius and Saba',
    code: 'BQ',
    timezone: 'SA Western Standard Time',
    utc: 'UTC-04:00',
    mobileCode: '+599',
  },
  {
    name: 'Bosnia and Herzegovina',
    code: 'BA',
    timezone: 'Central European Standard Time',
    utc: 'UTC+01:00',
    mobileCode: '+387',
  },
  {
    name: 'Botswana',
    code: 'BW',
    timezone: 'South Africa Standard Time',
    utc: 'UTC+02:00',
    mobileCode: '+267',
  },
  {
    name: 'Bouvet Island',
    code: 'BV',
    timezone: 'UTC',
    utc: 'UTC',
    mobileCode: '+',
  },
  {
    name: 'Brazil',
    code: 'BR',
    timezone: 'E. South America Standard Time',
    utc: 'UTC-03:00',
    mobileCode: '+55',
  },
  {
    name: 'British Indian Ocean Territory',
    code: 'IO',
    timezone: 'Central Asia Standard Time',
    utc: 'UTC+06:00',
    mobileCode: '+246',
  },
  {
    name: 'Brunei',
    code: 'BN',
    timezone: 'Singapore Standard Time',
    utc: 'UTC+08:00',
    mobileCode: '+673',
  },
  {
    name: 'Bulgaria',
    code: 'BG',
    timezone: 'FLE Standard Time',
    utc: 'UTC+02:00',
    mobileCode: '+359',
  },
  {
    name: 'Burkina Faso',
    code: 'BF',
    timezone: 'Greenwich Standard Time',
    utc: 'UTC',
    mobileCode: '+226',
  },
  {
    name: 'Burundi',
    code: 'BI',
    timezone: 'South Africa Standard Time',
    utc: 'UTC+02:00',
    mobileCode: '+257',
  },
  {
    name: 'Cabo Verde',
    code: 'CV',
    timezone: 'Cape Verde Standard Time',
    utc: 'UTC-01:00',
    mobileCode: '+238',
  },
  {
    name: 'Cambodia',
    code: 'KH',
    timezone: 'SE Asia Standard Time',
    utc: 'UTC+07:00',
    mobileCode: '+855',
  },
  {
    name: 'Cameroon',
    code: 'CM',
    timezone: 'W. Central Africa Standard Time',
    utc: 'UTC+01:00',
    mobileCode: '+237',
  },
  {
    name: 'Canada',
    code: 'CA',
    timezone: 'Eastern Standard Time',
    utc: 'UTC-05:00',
    mobileCode: '+1',
  },
  {
    name: 'Cayman Islands',
    code: 'KY',
    timezone: 'SA Pacific Standard Time',
    utc: 'UTC-05:00',
    mobileCode: '+1-345',
  },
  {
    name: 'Central African Republic',
    code: 'CF',
    timezone: 'W. Central Africa Standard Time',
    utc: 'UTC+01:00',
    mobileCode: '+236',
  },
  {
    name: 'Chad',
    code: 'TD',
    timezone: 'W. Central Africa Standard Time',
    utc: 'UTC+01:00',
    mobileCode: '+235',
  },
  {
    name: 'Chile',
    code: 'CL',
    timezone: 'Pacific SA Standard Time',
    utc: 'UTC-03:00',
    mobileCode: '+56',
  },
  {
    name: 'China',
    code: 'CN',
    timezone: 'China Standard Time',
    utc: 'UTC+08:00',
    mobileCode: '+86',
  },
  {
    name: 'Christmas Island',
    code: 'CX',
    timezone: 'SE Asia Standard Time',
    utc: 'UTC+07:00',
    mobileCode: '+61',
  },
  {
    name: 'Cocos (Keeling) Islands',
    code: 'CC',
    timezone: 'Myanmar Standard Time',
    utc: 'UTC+06:30',
    mobileCode: '+61',
  },
  {
    name: 'Colombia',
    code: 'CO',
    timezone: 'SA Pacific Standard Time',
    utc: 'UTC-05:00',
    mobileCode: '+57',
  },
  {
    name: 'Comoros',
    code: 'KM',
    timezone: 'E. Africa Standard Time',
    utc: 'UTC+03:00',
    mobileCode: '+269',
  },
  {
    name: 'Congo',
    code: 'CG',
    timezone: 'W. Central Africa Standard Time',
    utc: 'UTC+01:00',
    mobileCode: '+242',
  },
  {
    name: 'Congo (DRC)',
    code: 'CD',
    timezone: 'W. Central Africa Standard Time',
    utc: 'UTC+01:00',
    mobileCode: '+243',
  },
  {
    name: 'Cook Islands',
    code: 'CK',
    timezone: 'Hawaiian Standard Time',
    utc: 'UTC-10:00',
    mobileCode: '+682',
  },
  {
    name: 'Costa Rica',
    code: 'CR',
    timezone: 'Central America Standard Time',
    utc: 'UTC-06:00',
    mobileCode: '+506',
  },
  {
    name: "Côte d'Ivoire",
    code: 'CI',
    timezone: 'Greenwich Standard Time',
    utc: 'UTC',
    mobileCode: '+225',
  },
  {
    name: 'Croatia',
    code: 'HR',
    timezone: 'Central European Standard Time',
    utc: 'UTC+01:00',
    mobileCode: '+385',
  },
  {
    name: 'Cuba',
    code: 'CU',
    timezone: 'Eastern Standard Time',
    utc: 'UTC-05:00',
    mobileCode: '+53',
  },
  {
    name: 'Curaçao',
    code: 'CW',
    timezone: 'SA Western Standard Time',
    utc: 'UTC-04:00',
    mobileCode: '+599',
  },
  {
    name: 'Cyprus',
    code: 'CY',
    timezone: 'E. Europe Standard Time',
    utc: 'UTC+02:00',
    mobileCode: '+357',
  },
  {
    name: 'Czech Republic',
    code: 'CZ',
    timezone: 'Central Europe Standard Time',
    utc: 'UTC+01:00',
    mobileCode: '+420',
  },
  {
    name: 'Democratic Republic of Timor-Leste',
    code: 'TL',
    timezone: 'Tokyo Standard Time',
    utc: 'UTC+09:00',
    mobileCode: '+670',
  },
  {
    name: 'Denmark',
    code: 'DK',
    timezone: 'Romance Standard Time',
    utc: 'UTC+01:00',
    mobileCode: '+45',
  },
  {
    name: 'Djibouti',
    code: 'DJ',
    timezone: 'E. Africa Standard Time',
    utc: 'UTC+03:00',
    mobileCode: '+253',
  },
  {
    name: 'Dominica',
    code: 'DM',
    timezone: 'SA Western Standard Time',
    utc: 'UTC-04:00',
    mobileCode: '+1-767',
  },
  {
    name: 'Dominican Republic',
    code: 'DO',
    timezone: 'SA Western Standard Time',
    utc: 'UTC-04:00',
    mobileCode: '+1-809 and 1-829',
  },
  {
    name: 'Ecuador',
    code: 'EC',
    timezone: 'SA Pacific Standard Time',
    utc: 'UTC-05:00',
    mobileCode: '+593',
  },
  {
    name: 'Egypt',
    code: 'EG',
    timezone: 'Egypt Standard Time',
    utc: 'UTC+02:00',
    mobileCode: '+20',
  },
  {
    name: 'El Salvador',
    code: 'SV',
    timezone: 'Central America Standard Time',
    utc: 'UTC-06:00',
    mobileCode: '+503',
  },
  {
    name: 'Equatorial Guinea',
    code: 'GQ',
    timezone: 'W. Central Africa Standard Time',
    utc: 'UTC+01:00',
    mobileCode: '+240',
  },
  {
    name: 'Eritrea',
    code: 'ER',
    timezone: 'E. Africa Standard Time',
    utc: 'UTC+03:00',
    mobileCode: '+291',
  },
  {
    name: 'Estonia',
    code: 'EE',
    timezone: 'FLE Standard Time',
    utc: 'UTC+02:00',
    mobileCode: '+372',
  },
  {
    name: 'Ethiopia',
    code: 'ET',
    timezone: 'E. Africa Standard Time',
    utc: 'UTC+03:00',
    mobileCode: '+251',
  },
  {
    name: 'Falkland Islands (Islas Malvinas)',
    code: 'FK',
    timezone: 'SA Eastern Standard Time',
    utc: 'UTC-03:00',
    mobileCode: '+500',
  },
  {
    name: 'Faroe Islands',
    code: 'FO',
    timezone: 'GMT Standard Time',
    utc: 'UTC',
    mobileCode: '+298',
  },
  {
    name: 'Fiji Islands',
    code: 'FJ',
    timezone: 'Fiji Standard Time',
    utc: 'UTC+12:00',
    mobileCode: '+679',
  },
  {
    name: 'Finland',
    code: 'FI',
    timezone: 'FLE Standard Time',
    utc: 'UTC+02:00',
    mobileCode: '+358',
  },
  {
    name: 'France',
    code: 'FR',
    timezone: 'Romance Standard Time',
    utc: 'UTC+01:00',
    mobileCode: '+33',
  },
  {
    name: 'French Guiana',
    code: 'GF',
    timezone: 'SA Eastern Standard Time',
    utc: 'UTC-03:00',
    mobileCode: '+594',
  },
  {
    name: 'French Polynesia',
    code: 'PF',
    timezone: 'Hawaiian Standard Time',
    utc: 'UTC-10:00',
    mobileCode: '+689',
  },
  {
    name: 'French Southern and Antarctic Lands',
    code: 'TF',
    timezone: 'West Asia Standard Time',
    utc: 'UTC+05:00',
    mobileCode: '+',
  },
  {
    name: 'Gabon',
    code: 'GA',
    timezone: 'W. Central Africa Standard Time',
    utc: 'UTC+01:00',
    mobileCode: '+241',
  },
  {
    name: 'Gambia, The',
    code: 'GM',
    timezone: 'Greenwich Standard Time',
    utc: 'UTC',
    mobileCode: '+220',
  },
  {
    name: 'Georgia',
    code: 'GE',
    timezone: 'Georgian Standard Time',
    utc: 'UTC+04:00',
    mobileCode: '+995',
  },
  {
    name: 'Germany',
    code: 'DE',
    timezone: 'W. Europe Standard Time',
    utc: 'UTC+01:00',
    mobileCode: '+49',
  },
  {
    name: 'Ghana',
    code: 'GH',
    timezone: 'Greenwich Standard Time',
    utc: 'UTC',
    mobileCode: '+233',
  },
  {
    name: 'Gibraltar',
    code: 'GI',
    timezone: 'W. Europe Standard Time',
    utc: 'UTC+01:00',
    mobileCode: '+350',
  },
  {
    name: 'Greece',
    code: 'GR',
    timezone: 'GTB Standard Time',
    utc: 'UTC+02:00',
    mobileCode: '+30',
  },
  {
    name: 'Greenland',
    code: 'GL',
    timezone: 'Greenland Standard Time',
    utc: 'UTC-03:00',
    mobileCode: '+299',
  },
  {
    name: 'Grenada',
    code: 'GD',
    timezone: 'SA Western Standard Time',
    utc: 'UTC-04:00',
    mobileCode: '+1-473',
  },
  {
    name: 'Guadeloupe',
    code: 'GP',
    timezone: 'SA Western Standard Time',
    utc: 'UTC-04:00',
    mobileCode: '+590',
  },
  {
    name: 'Guam',
    code: 'GU',
    timezone: 'West Pacific Standard Time',
    utc: 'UTC+10:00',
    mobileCode: '+1-671',
  },
  {
    name: 'Guatemala',
    code: 'GT',
    timezone: 'Central America Standard Time',
    utc: 'UTC-06:00',
    mobileCode: '+502',
  },
  {
    name: 'Guernsey',
    code: 'GG',
    timezone: 'GMT Standard Time',
    utc: 'UTC',
    mobileCode: '+44-1481',
  },
  {
    name: 'Guinea',
    code: 'GN',
    timezone: 'Greenwich Standard Time',
    utc: 'UTC',
    mobileCode: '+224',
  },
  {
    name: 'Guinea-Bissau',
    code: 'GW',
    timezone: 'Greenwich Standard Time',
    utc: 'UTC',
    mobileCode: '+245',
  },
  {
    name: 'Guyana',
    code: 'GY',
    timezone: 'SA Western Standard Time',
    utc: 'UTC-04:00',
    mobileCode: '+592',
  },
  {
    name: 'Haiti',
    code: 'HT',
    timezone: 'Eastern Standard Time',
    utc: 'UTC-05:00',
    mobileCode: '+509',
  },
  {
    name: 'Heard Island and McDonald Islands',
    code: 'HM',
    timezone: 'Mauritius Standard Time',
    utc: 'UTC+04:00',
    mobileCode: '+ ',
  },
  {
    name: 'Honduras',
    code: 'HN',
    timezone: 'Central America Standard Time',
    utc: 'UTC-06:00',
    mobileCode: '+504',
  },
  {
    name: 'Hong Kong SAR',
    code: 'HK',
    timezone: 'China Standard Time',
    utc: 'UTC+08:00',
    mobileCode: '+852',
  },
  {
    name: 'Hungary',
    code: 'HU',
    timezone: 'Central Europe Standard Time',
    utc: 'UTC+01:00',
    mobileCode: '+36',
  },
  {
    name: 'Iceland',
    code: 'IS',
    timezone: 'Greenwich Standard Time',
    utc: 'UTC',
    mobileCode: '+354',
  },
  {
    name: 'India',
    code: 'IN',
    timezone: 'India Standard Time',
    utc: 'UTC+05:30',
    mobileCode: '+91',
  },
  {
    name: 'Indonesia',
    code: 'ID',
    timezone: 'SE Asia Standard Time',
    utc: 'UTC+07:00',
    mobileCode: '+62',
  },
  {
    name: 'Iran',
    code: 'IR',
    timezone: 'Iran Standard Time',
    utc: 'UTC+03:30',
    mobileCode: '+98',
  },
  {
    name: 'Iraq',
    code: 'IQ',
    timezone: 'Arabic Standard Time',
    utc: 'UTC+03:00',
    mobileCode: '+964',
  },
  {
    name: 'Ireland',
    code: 'IE',
    timezone: 'GMT Standard Time',
    utc: 'UTC',
    mobileCode: '+353',
  },
  {
    name: 'Israel',
    code: 'IL',
    timezone: 'Israel Standard Time',
    utc: 'UTC+02:00',
    mobileCode: '+972',
  },
  {
    name: 'Italy',
    code: 'IT',
    timezone: 'W. Europe Standard Time',
    utc: 'UTC+01:00',
    mobileCode: '+39',
  },
  {
    name: 'Jamaica',
    code: 'JM',
    timezone: 'SA Pacific Standard Time',
    utc: 'UTC-05:00',
    mobileCode: '+1-876',
  },
  {
    name: 'Jan Mayen',
    code: 'SJ',
    timezone: 'W. Europe Standard Time',
    utc: 'UTC+01:00',
    mobileCode: '+47',
  },
  {
    name: 'Japan',
    code: 'JP',
    timezone: 'Tokyo Standard Time',
    utc: 'UTC+09:00',
    mobileCode: '+81',
  },
  {
    name: 'Jersey',
    code: 'JE',
    timezone: 'GMT Standard Time',
    utc: 'UTC',
    mobileCode: '+44-1534',
  },
  {
    name: 'Jordan',
    code: 'JO',
    timezone: 'Jordan Standard Time',
    utc: 'UTC+02:00',
    mobileCode: '+962',
  },
  {
    name: 'Kazakhstan',
    code: 'KZ',
    timezone: 'Central Asia Standard Time',
    utc: 'UTC+06:00',
    mobileCode: '+7',
  },
  {
    name: 'Kenya',
    code: 'KE',
    timezone: 'E. Africa Standard Time',
    utc: 'UTC+03:00',
    mobileCode: '+254',
  },
  {
    name: 'Kiribati',
    code: 'KI',
    timezone: 'UTC+12',
    utc: 'UTC+12:00',
    mobileCode: '+686',
  },
  {
    name: 'Korea',
    code: 'KR',
    timezone: 'Korea Standard Time',
    utc: 'UTC+09:00',
    mobileCode: '+82',
  },
  {
    name: 'Kosovo',
    code: 'XK',
    timezone: 'Central European Standard Time',
    utc: 'UTC+01:00',
    mobileCode: '+',
  },
  {
    name: 'Kuwait',
    code: 'KW',
    timezone: 'Arab Standard Time',
    utc: 'UTC+03:00',
    mobileCode: '+965',
  },
  {
    name: 'Kyrgyzstan',
    code: 'KG',
    timezone: 'Central Asia Standard Time',
    utc: 'UTC+06:00',
    mobileCode: '+996',
  },
  {
    name: 'Laos',
    code: 'LA',
    timezone: 'SE Asia Standard Time',
    utc: 'UTC+07:00',
    mobileCode: '+856',
  },
  {
    name: 'Latvia',
    code: 'LV',
    timezone: 'FLE Standard Time',
    utc: 'UTC+02:00',
    mobileCode: '+371',
  },
  {
    name: 'Lebanon',
    code: 'LB',
    timezone: 'Middle East Standard Time',
    utc: 'UTC+02:00',
    mobileCode: '+961',
  },
  {
    name: 'Lesotho',
    code: 'LS',
    timezone: 'South Africa Standard Time',
    utc: 'UTC+02:00',
    mobileCode: '+266',
  },
  {
    name: 'Liberia',
    code: 'LR',
    timezone: 'Greenwich Standard Time',
    utc: 'UTC',
    mobileCode: '+231',
  },
  {
    name: 'Libya',
    code: 'LY',
    timezone: 'E. Europe Standard Time',
    utc: 'UTC+02:00',
    mobileCode: '+218',
  },
  {
    name: 'Liechtenstein',
    code: 'LI',
    timezone: 'W. Europe Standard Time',
    utc: 'UTC+01:00',
    mobileCode: '+423',
  },
  {
    name: 'Lithuania',
    code: 'LT',
    timezone: 'FLE Standard Time',
    utc: 'UTC+02:00',
    mobileCode: '+370',
  },
  {
    name: 'Luxembourg',
    code: 'LU',
    timezone: 'W. Europe Standard Time',
    utc: 'UTC+01:00',
    mobileCode: '+352',
  },
  {
    name: 'Macao SAR',
    code: 'MO',
    timezone: 'China Standard Time',
    utc: 'UTC+08:00',
    mobileCode: '+853',
  },
  {
    name: 'Macedonia, Former Yugoslav Republic of',
    code: 'MK',
    timezone: 'Central European Standard Time',
    utc: 'UTC+01:00',
    mobileCode: '+389',
  },
  {
    name: 'Madagascar',
    code: 'MG',
    timezone: 'E. Africa Standard Time',
    utc: 'UTC+03:00',
    mobileCode: '+261',
  },
  {
    name: 'Malawi',
    code: 'MW',
    timezone: 'South Africa Standard Time',
    utc: 'UTC+02:00',
    mobileCode: '+265',
  },
  {
    name: 'Malaysia',
    code: 'MY',
    timezone: 'Singapore Standard Time',
    utc: 'UTC+08:00',
    mobileCode: '+60',
  },
  {
    name: 'Maldives',
    code: 'MV',
    timezone: 'West Asia Standard Time',
    utc: 'UTC+05:00',
    mobileCode: '+960',
  },
  {
    name: 'Mali',
    code: 'ML',
    timezone: 'Greenwich Standard Time',
    utc: 'UTC',
    mobileCode: '+223',
  },
  {
    name: 'Malta',
    code: 'MT',
    timezone: 'W. Europe Standard Time',
    utc: 'UTC+01:00',
    mobileCode: '+356',
  },
  {
    name: 'Man, Isle of',
    code: 'IM',
    timezone: 'GMT Standard Time',
    utc: 'UTC',
    mobileCode: '+44-1624',
  },
  {
    name: 'Marshall Islands',
    code: 'MH',
    timezone: 'UTC+12',
    utc: 'UTC+12:00',
    mobileCode: '+692',
  },
  {
    name: 'Martinique',
    code: 'MQ',
    timezone: 'SA Western Standard Time',
    utc: 'UTC-04:00',
    mobileCode: '+596',
  },
  {
    name: 'Mauritania',
    code: 'MR',
    timezone: 'Greenwich Standard Time',
    utc: 'UTC',
    mobileCode: '+222',
  },
  {
    name: 'Mauritius',
    code: 'MU',
    timezone: 'Mauritius Standard Time',
    utc: 'UTC+04:00',
    mobileCode: '+230',
  },
  {
    name: 'Mayotte',
    code: 'YT',
    timezone: 'E. Africa Standard Time',
    utc: 'UTC+03:00',
    mobileCode: '+262',
  },
  {
    name: 'Mexico',
    code: 'MX',
    timezone: 'Central Standard Time (Mexico)',
    utc: 'UTC-06:00',
    mobileCode: '+52',
  },
  {
    name: 'Micronesia',
    code: 'FM',
    timezone: 'West Pacific Standard Time',
    utc: 'UTC+10:00',
    mobileCode: '+691',
  },
  {
    name: 'Moldova',
    code: 'MD',
    timezone: 'GTB Standard Time',
    utc: 'UTC+02:00',
    mobileCode: '+373',
  },
  {
    name: 'Monaco',
    code: 'MC',
    timezone: 'W. Europe Standard Time',
    utc: 'UTC+01:00',
    mobileCode: '+377',
  },
  {
    name: 'Mongolia',
    code: 'MN',
    timezone: 'Ulaanbaatar Standard Time',
    utc: 'UTC+08:00',
    mobileCode: '+976',
  },
  {
    name: 'Montenegro',
    code: 'ME',
    timezone: 'Central European Standard Time',
    utc: 'UTC+01:00',
    mobileCode: '+382',
  },
  {
    name: 'Montserrat',
    code: 'MS',
    timezone: 'SA Western Standard Time',
    utc: 'UTC-04:00',
    mobileCode: '+1-664',
  },
  {
    name: 'Morocco',
    code: 'MA',
    timezone: 'Morocco Standard Time',
    utc: 'UTC',
    mobileCode: '+212',
  },
  {
    name: 'Mozambique',
    code: 'MZ',
    timezone: 'South Africa Standard Time',
    utc: 'UTC+02:00',
    mobileCode: '+258',
  },
  {
    name: 'Myanmar',
    code: 'MM',
    timezone: 'Myanmar Standard Time',
    utc: 'UTC+06:30',
    mobileCode: '+95',
  },
  {
    name: 'Namibia',
    code: 'NA',
    timezone: 'Namibia Standard Time',
    utc: 'UTC+01:00',
    mobileCode: '+264',
  },
  {
    name: 'Nauru',
    code: 'NR',
    timezone: 'UTC+12',
    utc: 'UTC+12:00',
    mobileCode: '+674',
  },
  {
    name: 'Nepal',
    code: 'NP',
    timezone: 'Nepal Standard Time',
    utc: 'UTC+05:45',
    mobileCode: '+977',
  },
  {
    name: 'Netherlands',
    code: 'NL',
    timezone: 'W. Europe Standard Time',
    utc: 'UTC+01:00',
    mobileCode: '+31',
  },
  {
    name: 'New Caledonia',
    code: 'NC',
    timezone: 'Central Pacific Standard Time',
    utc: 'UTC+11:00',
    mobileCode: '+687',
  },
  {
    name: 'New Zealand',
    code: 'NZ',
    timezone: 'New Zealand Standard Time',
    utc: 'UTC+12:00',
    mobileCode: '+64',
  },
  {
    name: 'Nicaragua',
    code: 'NI',
    timezone: 'Central America Standard Time',
    utc: 'UTC-06:00',
    mobileCode: '+505',
  },
  {
    name: 'Niger',
    code: 'NE',
    timezone: 'W. Central Africa Standard Time',
    utc: 'UTC+01:00',
    mobileCode: '+227',
  },
  {
    name: 'Nigeria',
    code: 'NG',
    timezone: 'W. Central Africa Standard Time',
    utc: 'UTC+01:00',
    mobileCode: '+234',
  },
  {
    name: 'Niue',
    code: 'NU',
    timezone: 'UTC-11',
    utc: 'UTC-11:00',
    mobileCode: '+683',
  },
  {
    name: 'Norfolk Island',
    code: 'NF',
    timezone: 'Central Pacific Standard Time',
    utc: 'UTC+11:00',
    mobileCode: '+672',
  },
  {
    name: 'North Korea',
    code: 'KP',
    timezone: 'Korea Standard Time',
    utc: 'UTC+09:00',
    mobileCode: '+850',
  },
  {
    name: 'Northern Mariana Islands',
    code: 'MP',
    timezone: 'West Pacific Standard Time',
    utc: 'UTC+10:00',
    mobileCode: '+1-670',
  },
  {
    name: 'Norway',
    code: 'NO',
    timezone: 'W. Europe Standard Time',
    utc: 'UTC+01:00',
    mobileCode: '+47',
  },
  {
    name: 'Oman',
    code: 'OM',
    timezone: 'Arabian Standard Time',
    utc: 'UTC+04:00',
    mobileCode: '+968',
  },
  {
    name: 'Pakistan',
    code: 'PK',
    timezone: 'Pakistan Standard Time',
    utc: 'UTC+05:00',
    mobileCode: '+92',
  },
  {
    name: 'Palau',
    code: 'PW',
    timezone: 'Tokyo Standard Time',
    utc: 'UTC+09:00',
    mobileCode: '+680',
  },
  {
    name: 'Palestinian Authority',
    code: 'PS',
    timezone: 'Egypt Standard Time',
    utc: 'UTC+02:00',
    mobileCode: '+970',
  },
  {
    name: 'Panama',
    code: 'PA',
    timezone: 'SA Pacific Standard Time',
    utc: 'UTC-05:00',
    mobileCode: '+507',
  },
  {
    name: 'Papua New Guinea',
    code: 'PG',
    timezone: 'West Pacific Standard Time',
    utc: 'UTC+10:00',
    mobileCode: '+675',
  },
  {
    name: 'Paraguay',
    code: 'PY',
    timezone: 'Paraguay Standard Time',
    utc: 'UTC-04:00',
    mobileCode: '+595',
  },
  {
    name: 'Peru',
    code: 'PE',
    timezone: 'SA Pacific Standard Time',
    utc: 'UTC-05:00',
    mobileCode: '+51',
  },
  {
    name: 'Philippines',
    code: 'PH',
    timezone: 'Singapore Standard Time',
    utc: 'UTC+08:00',
    mobileCode: '+63',
  },
  {
    name: 'Pitcairn Islands',
    code: 'PN',
    timezone: 'Pacific Standard Time',
    utc: 'UTC-08:00',
    mobileCode: '+870',
  },
  {
    name: 'Poland',
    code: 'PL',
    timezone: 'Central European Standard Time',
    utc: 'UTC+01:00',
    mobileCode: '+48',
  },
  {
    name: 'Portugal',
    code: 'PT',
    timezone: 'GMT Standard Time',
    utc: 'UTC',
    mobileCode: '+351',
  },
  {
    name: 'Puerto Rico',
    code: 'PR',
    timezone: 'SA Western Standard Time',
    utc: 'UTC-04:00',
    mobileCode: '+1-787 and 1-939',
  },
  {
    name: 'Qatar',
    code: 'QA',
    timezone: 'Arab Standard Time',
    utc: 'UTC+03:00',
    mobileCode: '+974',
  },
  {
    name: 'Reunion',
    code: 'RE',
    timezone: 'Mauritius Standard Time',
    utc: 'UTC+04:00',
    mobileCode: '+262',
  },
  {
    name: 'Romania',
    code: 'RO',
    timezone: 'GTB Standard Time',
    utc: 'UTC+02:00',
    mobileCode: '+40',
  },
  {
    name: 'Russia',
    code: 'RU',
    timezone: 'Russian Standard Time',
    utc: 'UTC+03:00',
    mobileCode: '+7',
  },
  {
    name: 'Rwanda',
    code: 'RW',
    timezone: 'South Africa Standard Time',
    utc: 'UTC+02:00',
    mobileCode: '+250',
  },
  {
    name: 'Saint Barthélemy',
    code: 'BL',
    timezone: 'SA Western Standard Time',
    utc: 'UTC-04:00',
    mobileCode: '+590',
  },
  {
    name: 'Saint Helena, Ascension and Tristan da Cunha',
    code: 'SH',
    timezone: 'Greenwich Standard Time',
    utc: 'UTC',
    mobileCode: '+290',
  },
  {
    name: 'Saint Kitts and Nevis',
    code: 'KN',
    timezone: 'SA Western Standard Time',
    utc: 'UTC-04:00',
    mobileCode: '+1-869',
  },
  {
    name: 'Saint Lucia',
    code: 'LC',
    timezone: 'SA Western Standard Time',
    utc: 'UTC-04:00',
    mobileCode: '+1-758',
  },
  {
    name: 'Saint Martin (French part)',
    code: 'MF',
    timezone: 'SA Western Standard Time',
    utc: 'UTC-04:00',
    mobileCode: '+590',
  },
  {
    name: 'Saint Pierre and Miquelon',
    code: 'PM',
    timezone: 'Greenland Standard Time',
    utc: 'UTC-03:00',
    mobileCode: '+508',
  },
  {
    name: 'Saint Vincent and the Grenadines',
    code: 'VC',
    timezone: 'SA Western Standard Time',
    utc: 'UTC-04:00',
    mobileCode: '+1-784',
  },
  {
    name: 'Samoa',
    code: 'WS',
    timezone: 'Samoa Standard Time',
    utc: 'UTC+13:00',
    mobileCode: '+685',
  },
  {
    name: 'San Marino',
    code: 'SM',
    timezone: 'W. Europe Standard Time',
    utc: 'UTC+01:00',
    mobileCode: '+378',
  },
  {
    name: 'São Tomé and Príncipe',
    code: 'ST',
    timezone: 'Greenwich Standard Time',
    utc: 'UTC',
    mobileCode: '+239',
  },
  {
    name: 'Saudi Arabia',
    code: 'SA',
    timezone: 'Arab Standard Time',
    utc: 'UTC+03:00',
    mobileCode: '+966',
  },
  {
    name: 'Senegal',
    code: 'SN',
    timezone: 'Greenwich Standard Time',
    utc: 'UTC',
    mobileCode: '+221',
  },
  {
    name: 'Serbia',
    code: 'RS',
    timezone: 'Central Europe Standard Time',
    utc: 'UTC+01:00',
    mobileCode: '+381',
  },
  {
    name: 'Seychelles',
    code: 'SC',
    timezone: 'Mauritius Standard Time',
    utc: 'UTC+04:00',
    mobileCode: '+248',
  },
  {
    name: 'Sierra Leone',
    code: 'SL',
    timezone: 'Greenwich Standard Time',
    utc: 'UTC',
    mobileCode: '+232',
  },
  {
    name: 'Singapore',
    code: 'SG',
    timezone: 'Singapore Standard Time',
    utc: 'UTC+08:00',
    mobileCode: '+65',
  },
  {
    name: 'Sint Maarten (Dutch part)',
    code: 'SX',
    timezone: 'SA Western Standard Time',
    utc: 'UTC-04:00',
    mobileCode: '+599',
  },
  {
    name: 'Slovakia',
    code: 'SK',
    timezone: 'Central Europe Standard Time',
    utc: 'UTC+01:00',
    mobileCode: '+421',
  },
  {
    name: 'Slovenia',
    code: 'SI',
    timezone: 'Central Europe Standard Time',
    utc: 'UTC+01:00',
    mobileCode: '+386',
  },
  {
    name: 'Solomon Islands',
    code: 'SB',
    timezone: 'Central Pacific Standard Time',
    utc: 'UTC+11:00',
    mobileCode: '+677',
  },
  {
    name: 'Somalia',
    code: 'SO',
    timezone: 'E. Africa Standard Time',
    utc: 'UTC+03:00',
    mobileCode: '+252',
  },
  {
    name: 'South Africa',
    code: 'ZA',
    timezone: 'South Africa Standard Time',
    utc: 'UTC+02:00',
    mobileCode: '+27',
  },
  {
    name: 'South Georgia and the South Sandwich Islands',
    code: 'GS',
    timezone: 'UTC-02',
    utc: 'UTC-02:00',
    mobileCode: '+',
  },
  {
    name: 'South Sudan',
    code: 'SS',
    timezone: 'E. Africa Standard Time',
    utc: 'UTC+03:00',
    mobileCode: '+211',
  },
  {
    name: 'Spain',
    code: 'ES',
    timezone: 'Romance Standard Time',
    utc: 'UTC+01:00',
    mobileCode: '+34',
  },
  {
    name: 'Sri Lanka',
    code: 'LK',
    timezone: 'Sri Lanka Standard Time',
    utc: 'UTC+05:30',
    mobileCode: '+94',
  },
  {
    name: 'Sudan',
    code: 'SD',
    timezone: 'E. Africa Standard Time',
    utc: 'UTC+03:00',
    mobileCode: '+249',
  },
  {
    name: 'Suriname',
    code: 'SR',
    timezone: 'SA Eastern Standard Time',
    utc: 'UTC-03:00',
    mobileCode: '+597',
  },
  {
    name: 'Svalbard',
    code: 'SJ',
    timezone: 'W. Europe Standard Time',
    utc: 'UTC+01:00',
    mobileCode: '+47',
  },
  {
    name: 'Swaziland',
    code: 'SZ',
    timezone: 'South Africa Standard Time',
    utc: 'UTC+02:00',
    mobileCode: '+268',
  },
  {
    name: 'Sweden',
    code: 'SE',
    timezone: 'W. Europe Standard Time',
    utc: 'UTC+01:00',
    mobileCode: '+46',
  },
  {
    name: 'Switzerland',
    code: 'CH',
    timezone: 'W. Europe Standard Time',
    utc: 'UTC+01:00',
    mobileCode: '+41',
  },
  {
    name: 'Syria',
    code: 'SY',
    timezone: 'Syria Standard Time',
    utc: 'UTC+02:00',
    mobileCode: '+963',
  },
  {
    name: 'Taiwan',
    code: 'TW',
    timezone: 'Taipei Standard Time',
    utc: 'UTC+08:00',
    mobileCode: '+886',
  },
  {
    name: 'Tajikistan',
    code: 'TJ',
    timezone: 'West Asia Standard Time',
    utc: 'UTC+05:00',
    mobileCode: '+992',
  },
  {
    name: 'Tanzania',
    code: 'TZ',
    timezone: 'E. Africa Standard Time',
    utc: 'UTC+03:00',
    mobileCode: '+255',
  },
  {
    name: 'Thailand',
    code: 'TH',
    timezone: 'SE Asia Standard Time',
    utc: 'UTC+07:00',
    mobileCode: '+66',
  },
  {
    name: 'Togo',
    code: 'TG',
    timezone: 'Greenwich Standard Time',
    utc: 'UTC',
    mobileCode: '+228',
  },
  {
    name: 'Tokelau',
    code: 'TK',
    timezone: 'Tonga Standard Time',
    utc: 'UTC+13:00',
    mobileCode: '+690',
  },
  {
    name: 'Tonga',
    code: 'TO',
    timezone: 'Tonga Standard Time',
    utc: 'UTC+13:00',
    mobileCode: '+676',
  },
  {
    name: 'Trinidad and Tobago',
    code: 'TT',
    timezone: 'SA Western Standard Time',
    utc: 'UTC-04:00',
    mobileCode: '+1-868',
  },
  {
    name: 'Tunisia',
    code: 'TN',
    timezone: 'W. Central Africa Standard Time',
    utc: 'UTC+01:00',
    mobileCode: '+216',
  },
  {
    name: 'Turkey',
    code: 'TR',
    timezone: 'Turkey Standard Time',
    utc: 'UTC+02:00',
    mobileCode: '+90',
  },
  {
    name: 'Turkmenistan',
    code: 'TM',
    timezone: 'West Asia Standard Time',
    utc: 'UTC+05:00',
    mobileCode: '+993',
  },
  {
    name: 'Turks and Caicos Islands',
    code: 'TC',
    timezone: 'Eastern Standard Time',
    utc: 'UTC-05:00',
    mobileCode: '+1-649',
  },
  {
    name: 'Tuvalu',
    code: 'TV',
    timezone: 'UTC+12',
    utc: 'UTC+12:00',
    mobileCode: '+688',
  },
  {
    name: 'U.S. Minor Outlying Islands',
    code: 'UM',
    timezone: 'UTC-11',
    utc: 'UTC-11:00',
    mobileCode: '+1',
  },
  {
    name: 'Uganda',
    code: 'UG',
    timezone: 'E. Africa Standard Time',
    utc: 'UTC+03:00',
    mobileCode: '+256',
  },
  {
    name: 'Ukraine',
    code: 'UA',
    timezone: 'FLE Standard Time',
    utc: 'UTC+02:00',
    mobileCode: '+380',
  },
  {
    name: 'United Arab Emirates',
    code: 'AE',
    timezone: 'Arabian Standard Time',
    utc: 'UTC+04:00',
    mobileCode: '+971',
  },
  {
    name: 'United Kingdom',
    code: 'GB',
    timezone: 'GMT Standard Time',
    utc: 'UTC',
    mobileCode: '+44',
  },
  {
    name: 'United States',
    code: 'US',
    timezone: 'Pacific Standard Time',
    utc: 'UTC-08:00',
    mobileCode: '+1',
  },
  {
    name: 'Uruguay',
    code: 'UY',
    timezone: 'Montevideo Standard Time',
    utc: 'UTC-03:00',
    mobileCode: '+598',
  },
  {
    name: 'Uzbekistan',
    code: 'UZ',
    timezone: 'West Asia Standard Time',
    utc: 'UTC+05:00',
    mobileCode: '+998',
  },
  {
    name: 'Vanuatu',
    code: 'VU',
    timezone: 'Central Pacific Standard Time',
    utc: 'UTC+11:00',
    mobileCode: '+678',
  },
  {
    name: 'Vatican City',
    code: 'VA',
    timezone: 'W. Europe Standard Time',
    utc: 'UTC+01:00',
    mobileCode: '+379',
  },
  {
    name: 'Vietnam',
    code: 'VN',
    timezone: 'SE Asia Standard Time',
    utc: 'UTC+07:00',
    mobileCode: '+84',
  },
  {
    name: 'Virgin Islands, U.S.',
    code: 'VI',
    timezone: 'SA Western Standard Time',
    utc: 'UTC-04:00',
    mobileCode: '+1-340',
  },
  {
    name: 'Virgin Islands, British',
    code: 'VG',
    timezone: 'SA Western Standard Time',
    utc: 'UTC-04:00',
    mobileCode: '+1-284',
  },
  {
    name: 'Wallis and Futuna',
    code: 'WF',
    timezone: 'UTC+12',
    utc: 'UTC+12:00',
    mobileCode: '+681',
  },
  {
    name: 'Yemen',
    code: 'YE',
    timezone: 'Arab Standard Time',
    utc: 'UTC+03:00',
    mobileCode: '+967',
  },
  {
    name: 'Zambia',
    code: 'ZM',
    timezone: 'South Africa Standard Time',
    utc: 'UTC+02:00',
    mobileCode: '+260',
  },
  {
    name: 'Zimbabwe',
    code: 'ZW',
    timezone: 'South Africa Standard Time',
    utc: 'UTC+02:00',
    mobileCode: '+263',
  },
];
  featureLimit: number = 8;
  termPlan = "Monthly";
  featureTypes: any = [];
  frequentFAQs: any = [];
  totalPlansData: any;
  filterPlansData: any;
  showPlanDetails: string = '';
  orderConfirmData: any;
  selectedPlan: any = {};
  selectedApp: any;
  serachIndexId: any;
  urlSafe: any;
  transactionId: any;
  payementSuccess: true;
  listPlanFeaturesData: any;
  paymentStatusInterval: any;
  invoiceOrderId: any;
  featuresExceededUsage: any = [];
  upgradePlanData:any={};
  selectedPaymentPage: string = 'payment_confirm';
  showLoader: boolean;
  payementResponse: any = {
    hostedPage: {
      transactionId: "",
      url: ""
    }
  };
  plansIdList = {
    free: 'fp_free',
    standardMonth: 'standard_monthly',
    standardYear: 'standard_yearly',
    enterpriceMonth: 'enterprise_monthly',
    enterpriceYear: 'enterprise_yearly'
  }
  overageDeatils: any = {}
  currentSubsciptionData: Subscription;
  isOverageShow: boolean = false;
  btnLoader: boolean = false;
  enterpriseForm: any = { name: '', email: '', message: '', phone: '' , company:'',country:''};
  @Input() componentType: string;
  @Output() upgradedEvent = new EventEmitter();
  constructor(public dialog: MatDialog,
    private service: ServiceInvokerService,
    private appSelectionService: AppSelectionService,
    public workflowService: WorkflowService,
    private authService: AuthService,
    public sanitizer: DomSanitizer,
    private notificationService: NotificationService,
    public localstore: LocalStoreService) { }
  @ViewChild('addOverageModel') addOverageModel: KRModalComponent;
  @ViewChild('changePlanModel') changePlanModel: KRModalComponent;
  @ViewChild('choosePlanModel') choosePlanModel: KRModalComponent;
  @ViewChild('paymentGatewayModel') paymentGatewayModel: KRModalComponent;
  @ViewChild('contactUsModel') contactUsModel: KRModalComponent;
  @ViewChild('confirmUpgradeModel') confirmUpgradeModel: KRModalComponent;
  @Output() updateBanner = new EventEmitter<{}>();
  @Output() plansData = new EventEmitter<''>();
  @ViewChild(PerfectScrollbarComponent) public directiveScroll: PerfectScrollbarComponent;
  ngOnInit(): void {
    this.getAllPlans();
    this.selectedApp = this.workflowService.selectedApp();
    this.serachIndexId = this.selectedApp?.searchIndexes[0]?._id;
    this.currentSubsciptionData = this.appSelectionService.currentSubscription.subscribe(res => {
      this.selectedPlan = res?.subscription;
    });
  }
  clearcontent() {
    if ($('#searchBoxId') && $('#searchBoxId').length) {
      $('#searchBoxId')[0].value = "";
      this.search_country = '';
    }
  }
  //get plans api
  getAllPlans() {
    this.service.invoke('get.pricingPlans').subscribe(res => {
      this.featureTypes = res?.featureTypes;
      this.frequentFAQs = res?.FAQS;
      this.totalPlansData = res?.plans?.sort((a, b) => { return a.displayOrder - b.displayOrder });
      this.typeOfPlan("Monthly");
      this.totalPlansData.forEach(data => {
        let dat = Object.values(data.featureAccess);
        data = Object.assign(data, { "featureData": dat });
      });
      this.plansData.emit();
    }, errRes => {
      if (localStorage.jStorage) {
        if (errRes && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0] && errRes.error.errors[0].msg) {
          this.notificationService.notify(errRes.error.errors[0].msg, 'error');
        } else {
          this.notificationService.notify('Failed ', 'error');
        }
      }
    });
  }
  errorToaster(errRes, message) {
    if (errRes && errRes.error && errRes.error.errors && errRes.error.errors.length && errRes.error.errors[0].msg) {
      this.notificationService.notify(errRes.error.errors[0].msg, 'error');
    } else if (message) {
      this.notificationService.notify(message, 'error');
    } else {
      this.notificationService.notify('Somthing went worng', 'error');
    }
  }
  //open popup based on input parameter
  openSelectedPopup(type) {
    if (type === 'choose_plan') {
      if (this.appSelectionService.currentsubscriptionPlanDetails) {
        const currentSubscriptionPlan = this.appSelectionService.currentsubscriptionPlanDetails;
        this.selectedPlan = currentSubscriptionPlan?.subscription;
        this.choosePlanModalPopRef = this.choosePlanModel.open();
      }
    }
    else if (type === 'payment_gateway') {
      this.paymentGatewayModelPopRef = this.paymentGatewayModel.open();
    }
    else if (type === 'add_overage') {
      this.overageModal('open');
    }
  }
  //close popup based on input parameter
  closeSelectedPopup(type) {
    if (type === 'choose_plan') {
      this.termPlan = 'Monthly';
      this.typeOfPlan("Monthly");
      if (this.choosePlanModalPopRef?.close) this.choosePlanModalPopRef.close();
    }
    else if (type === 'payment_gateway') {
      this.selectedPaymentPage = 'payment_confirm';
      this.orderConfirmData = {};
      if (this.paymentStatusInterval) clearInterval(this.paymentStatusInterval);
      if (this.paymentGatewayModelPopRef?.close) this.paymentGatewayModelPopRef.close();
      if (this.componentType == 'experiment') {
        this.upgradedEvent.emit();
      }
    }
  }
  //close or open confirmUpgradeModel
  closeConfirmUpgradeModal(type,data?){
   if(type==='open'){
    this.upgradePlanData = data;
    console.log("upgradePlanData",this.upgradePlanData);
     this.confirmUpgradeModelPopRef=this.confirmUpgradeModel.open();
   }
   else if(type==='close'){
    if(this.confirmUpgradeModelPopRef?.close){
       this.btnLoader =false;
       this.confirmUpgradeModelPopRef?.close();
       this.upgradePlanData={};
    } 
   }
  }
  //hide spinner in payment page
  showHideSpinner() {
    setTimeout(() => {
      this.showLoader = false;
    }, 1500)
  }
  //open payment gateway popup
  openPaymentGateway() {
    this.selectedPaymentPage = 'payment_iframe';
    this.showLoader = true;
    this.selectedApp = this.workflowService.selectedApp();
    const userInfo: any = this.authService.getUserInfo() || {};
    const queryParams = {
      planId: this.orderConfirmData._id
    };
    const payload = {
      "streamId": this.selectedApp._id,
      "fName": userInfo.fName,
      "lName": userInfo.lName,
      "country": "India",
      "city": "Hyd",
      "address": "some address",
      "state": "Tel",
      "zip": 302016,
      "streamName": this.selectedApp.name,
      "quantity": 1
    }
    const appObserver = this.service.invoke('post.payement', queryParams, payload);
    appObserver.subscribe(res => {
      this.payementResponse = res;
      let url = this.payementResponse.hostedPage.url;
      this.invoiceOrderId = this.payementResponse.hostedPage.transactionId;
      this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(url);
      this.poling();
    }, errRes => {
      this.errorToaster(errRes, 'failed');
    });
  }
  poling() {
    this.paymentStatusInterval = setInterval(() => {
      this.getPayementStatus();
    }, 3000)
  }
  //payment status api
  getPayementStatus() {
    const queryParams = {
      streamId: this.selectedApp._id,
      transactionId: this.payementResponse.hostedPage.transactionId || this.invoiceOrderId
    };
    this.service.invoke('get.payementStatus', queryParams).subscribe(res => {
      if (res.state == 'success') {
        clearInterval(this.paymentStatusInterval);
        this.appSelectionService.getCurrentSubscriptionData();
        const message = this.isOverageShow ? 'Overages added successfully' : 'Plan Changed successfully';
        this.notificationService.notify(message, 'success');
        if (!this.isOverageShow) {
          this.selectedPaymentPage = 'payment_success';
          const obj = { msg: `Your previous payment of $ ${this.orderConfirmData?.planAmount} is processed successfully.`, type: 'success' };
          this.updateBanner.emit(obj);
          this.closeConfirmUpgradeModal('close');
        }
        else {
          if (this.btnLoader) this.btnLoader = false;
          this.overageModal('close');
        }
      } else if (res.state == 'failed') {
        clearInterval(this.paymentStatusInterval);
        const obj = { msg: `Your previous payment of $ ${this.orderConfirmData?.planAmount} was not processed. Please retry to upgrade your plan.`, type: 'failed' };
        this.updateBanner.emit(obj);
        if (this.btnLoader) this.btnLoader = false;
        if (!this.isOverageShow) this.selectedPaymentPage = 'payment_fail';
      }
    }, errRes => {
      this.errorToaster(errRes, 'failed to payment status');
    });
  }
  //open contact us popup
  contactusModel(type) {
    if (type === 'open') {
      const userInfo = this.localstore.getAuthInfo();
      this.enterpriseForm.name = userInfo.currentAccount.userInfo.fName;
      this.enterpriseForm.email = userInfo.currentAccount.userInfo.emailId;
      this.contactusModelPopRef = this.contactUsModel.open();
    }
    else if (type === 'close') {
      this.enterpriseForm = { name: '', email: '', message: '', phone: '', company:'',country:'' };
      if (this.contactusModelPopRef?.close) this.contactusModelPopRef.close();
    }
  }
  //open or close excess modal popup
  openExcessDataPopup(type) {
    if (type === 'open') {
      this.changePlanModelPopRef = this.changePlanModel.open();
    }
    else if (type === 'close') {
      if (this.changePlanModelPopRef?.close) this.changePlanModelPopRef.close();
    }
  }
  //submitEnterpriseRequest method
  submitEnterpriseRequest() {
    this.btnLoader = true;
    this.validations = true;
    this.selectedApp = this.workflowService.selectedApp();
    const queryParams = { "streamId": this.selectedApp?._id };
    const enterpriseRequest = this.service.invoke('post.enterpriseRequest', queryParams, this.enterpriseForm);
    enterpriseRequest.subscribe(res => {
      this.btnLoader = false;
      this.contactusModel('close');
      this.notificationService.notify('Thanks for providing the details', 'success');
    }, errRes => {
      this.btnLoader = false;
      this.errorToaster(errRes, errRes.error && errRes.error.errors[0].code);
    });
  }

  //payment plan for upgrade/downgrade
  downgradePlan() {
    this.btnLoader = true;
    this.orderConfirmData = this.upgradePlanData;
    this.selectedApp = this.workflowService.selectedApp();
    const payload = { "streamId": this.selectedApp._id, "targetPlanId": this.upgradePlanData?._id };
    const upgradePlan = this.service.invoke('put.planChange', {}, payload);
    upgradePlan.subscribe(res => {
      if (res.status === 'success' && res.type === 'downgrade') {
        this.closeSelectedPopup('choose_plan');
        this.notificationService.notify('Plan Changed successfully', 'success');
        this.appSelectionService.getCurrentSubscriptionData();
        const endDate = moment(this.selectedPlan.endDate).format("Do MMMM YYYY");
        const obj = { msg: `Your plan will be changed from Standard to Free by the end of the billing cycle i.e. ${endDate}.`, type: 'downgrade' };
        this.updateBanner.emit(obj);
        this.closeConfirmUpgradeModal('close');
      }
      else if (res.status === 'processing' && res.type === 'upgrade') {
        this.invoiceOrderId = res.transactionId;
        this.getPayementStatus();
      }
      else if (res.status === 'failed' && res.code === 'ERR_FAILED_ACCESS_EXCEEDED') {
        this.featuresExceededUsage = res?.featuresExceededUsage;
        this.btnLoader = false;
        // const currentSubscriptionPlan = this.appSelectionService.currentsubscriptionPlanDetails;
        // const usageData = currentSubscriptionPlan?.usage;
        // const featureArray: any = Object.values(usageData);
        // res?.featuresExceededUsage?.forEach(item => {
        //   const featureData = featureArray?.filter(feature => feature?.name === item);
        //   const obj = { name: item, used: featureData[0]?.used, limit: featureData[0]?.limit };
        //   this.featuresExceededUsage.push(obj);
        // })
        this.openExcessDataPopup('open');
      }
    }), errRes => {
      this.btnLoader =false;
      this.errorToaster(errRes, errRes?.error?.errors[0].code);
    };
  }
  //close payment gateway popup
  closePaymentGatewayPopup() {
    if (this.paymentGatewayModelPopRef && this.paymentGatewayModelPopRef.close) {
      if (this.paymentStatusInterval) {
        clearInterval(this.paymentStatusInterval);
      }
      this.paymentGatewayModelPopRef.close();
    }
  }
  //select type plan like monthly or yearly
  typeOfPlan(type) {
    this.filterPlansData = [];
    this.termPlan = type;
    for (let data of this.totalPlansData) {
      if (data?.billingUnit == type || data?.planId === 'fp_free') {
        this.filterPlansData.push(data);
      }
    }
    let listData = [...this.totalPlansData];
    this.listPlanFeaturesData = [];
    let listDataMonthlyFeature = [];
    listData.forEach(data => {
      Object.keys(data.featureAccess);
      Object.values(data.featureAccess);
      Object.entries(data.featureAccess);
      /** Pick only the Month Plans */
      if (data.planId == this.plansIdList.free || data.type == this.plansIdList.standardMonth || data.type == this.plansIdList.enterpriceMonth) {
        listDataMonthlyFeature.push(Object.entries(data.featureAccess))
      }
    })
    for (let i = 1; i <= listDataMonthlyFeature.length; i++) {
      if (listDataMonthlyFeature[i]) {
        for (let j = 0; j < listDataMonthlyFeature[i].length; j++) {
          if (listDataMonthlyFeature[i][j]) {
            if (listDataMonthlyFeature[i][j][0] == listDataMonthlyFeature[0][j][0]) { //comapre 3 records with 1st record's Key
              listDataMonthlyFeature[0][j].push(listDataMonthlyFeature[i][j][1])       // push the values array in 1st record
            }
          }
        }
      }
    }
    this.listPlanFeaturesData = listDataMonthlyFeature;
  }
  //based on choosePlanType in order confirm popup
  choosePlanType(type) {
    let data = this.totalPlansData.filter(plan => plan.name == this.orderConfirmData.name && plan.billingUnit == type);
    this.orderConfirmData = data[0];
  }
  //open | close add overage modal
  overageModal(type) {
    if (type === 'open') {
      const currentSubscriptionPlan = this.appSelectionService.currentsubscriptionPlanDetails;
      this.selectedPlan = currentSubscriptionPlan;
      this.totalPlansData.forEach(element => {
        if (element._id == currentSubscriptionPlan?.subscription?.planId) {
          this.overageDeatils = element.overage;
          this.overageDeatils = { ...this.overageDeatils, docCount: 0, queriesCount: 0 };
        }
      });
      this.addOverageModalPopRef = this.addOverageModel.open();
    }
    else if (type === 'close') {
      this.overageDeatils = {};
      this.selectedPlan = {};
      this.isOverageShow = false;
      if (this.addOverageModalPopRef?.close) this.addOverageModalPopRef.close();
    }
  }
  //add overage api
  buyOverage() {
    this.btnLoader = true;
    this.selectedApp = this.workflowService.selectedApp();
    const currentSubscriptionPlan = this.appSelectionService.currentsubscriptionPlanDetails;
    let overage = [];
    if (this.overageDeatils.docCount > 0) {
      overage.push({ "feature": "ingestDocs", "quantity": this.overageDeatils.docCount })
    }
    if (this.overageDeatils.queriesCount > 0) {
      overage.push({ "feature": "searchQueries", "quantity": this.overageDeatils.queriesCount })
    }
    const queryParams = {
      "streamId": this.selectedApp._id,
      "subscriptionId": currentSubscriptionPlan?.subscription?._id
    }
    const payload = { "overages": overage };
    const buyOverage = this.service.invoke('put.buyOverage', queryParams, payload);
    buyOverage.subscribe(res => {
      this.invoiceOrderId = res?.transactionId;
      this.isOverageShow = true;
      this.poling();
    }, errRes => {
      this.btnLoader = false;
      this.errorToaster(errRes, 'failed buy overage');
    });
  }

  //download invoice
  downloadInvoice() {
    this.selectedApp = this.workflowService.selectedApp();
    const queryParams = { "streamId": this.selectedApp?._id, "transactionId": this.invoiceOrderId };
    const getInvoice = this.service.invoke('get.getInvoiceDownload', queryParams);
    getInvoice.subscribe(res => {
      if (res?.length) {
        FileSaver.saveAs(res[0].viewInvoice + '&DownloadPdf=true', 'invoice_' + res[0]._id + '.pdf');
      }
      else {
        FileSaver.saveAs(res.viewInvoice + '&DownloadPdf=true', 'invoice_' + res._id + '.pdf');
      }
      this.notificationService.notify('Invoice Downloaded successfully', 'success');
    }, errRes => {
      this.errorToaster(errRes, 'Downloading Invoice failed');
    });
  }
  ngOnDestroy() {
    this.currentSubsciptionData ? this.currentSubsciptionData.unsubscribe() : false;
  }
}
