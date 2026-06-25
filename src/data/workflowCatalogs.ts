/**
 * Workflow Catalog Data
 * Typed version - setiap catalog memiliki: id, code, name, description, schedule, steps, status, nodes[], edges[]
 */

import type { WorkflowCatalog } from '../types'

export const workflowCatalogs: WorkflowCatalog[] = [
  {
    id: 'WF-001',
    code: 'WF-001',
    name: 'Host Metric Collection',
    description: 'Kumpulkan metrik host: disk, CPU, uptime, dan ping ke target IP.',
    schedule: 'Daily 02:00',
    steps: 6,
    status: 'AUTO',
    statusColor: 'cyan',
    riskLevel: 'LOW',
    nodes: [
      {
        id: '1', type: 'workflow', position: { x: 60, y: 300 },
        data: {
          nodeType: 'command',
          label: '1. Kumpulkan metrik host',
          subtitle: '5 command(s)',
          commands: [
            { text: 'hostname && uname -sr && uptime' },
            { text: 'df -P {mount_path} | tail -1' },
            { text: 'df -P {mount_path} | tail -1 | tr -s ...' },
            { text: 'ping -c 2 -W 1 {target_ip}' },
            { text: 'echo "host={device.hostname} ip={devi..."' }
          ]
        }
      },
      {
        id: '2', type: 'workflow', position: { x: 400, y: 60 },
        data: {
          nodeType: 'command',
          label: '2. Cabang dalam node (IF/ELSE)',
          subtitle: '3 command(s)',
          commands: [
            { text: 'if [ {disk_use_pct} -gt 80 ]; then...' },
            { text: 'echo "DISK_HIGH=true"' },
            { text: 'echo "DISK_HIGH=false"' }
          ]
        }
      },
      {
        id: '3', type: 'workflow', position: { x: 60, y: 500 },
        data: {
          nodeType: 'command',
          label: '3. Cabang STEP IF — disk kritis',
          subtitle: '3 command(s)',
          conditionLabel: 'IF: DISK_HIGH == FALSE',
          conditionType: 'false',
          commands: [
            { text: 'du -sh /var/log/* 2>/dev/null | sort ...' },
            { text: 'find /tmp -type f -mtime +7 2>/dev/nu...' },
            { text: 'echo "REMEDIATION disk={disk_use_pct}..."' }
          ]
        }
      },
      {
        id: '4', type: 'workflow', position: { x: 60, y: 700 },
        data: {
          nodeType: 'command',
          label: '4. Cabang STEP ELSE — disk normal',
          subtitle: '2 command(s)',
          commands: [
            { text: 'echo "DISK_OK host={device.hostname}"' },
            { text: 'logger -t noc "disk ok on {device.ho..."' }
          ]
        }
      },
      {
        id: '5', type: 'workflow', position: { x: 450, y: 500 },
        data: {
          nodeType: 'function',
          label: '5. Function getProduct → data',
          subtitle: 'getProduct',
          params: 'getProduct',
          bound: '1 BOUND'
        }
      },
      {
        id: '6', type: 'workflow', position: { x: 360, y: 660 },
        data: {
          nodeType: 'command',
          label: '6. Audit & ringkasan',
          subtitle: '2 command(s)',
          commands: [
            { text: 'echo "AUDIT job={job_number} host={de..."' },
            { text: 'tail -3 /tmp/trl-audit.log 2>/dev/nu...' }
          ]
        }
      }
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2', sourceHandle: 'success', targetHandle: 'top', type: 'workflow', data: { type: 'success', sequence: 1 } },
      { id: 'e1-5', source: '1', target: '5', sourceHandle: 'success', targetHandle: 'top', type: 'workflow', data: { type: 'success', sequence: 2 } },
      { id: 'e2-3', source: '2', target: '3', sourceHandle: 'success', targetHandle: 'top', type: 'workflow', data: { type: 'success', sequence: 3 } },
      { id: 'e2-5', source: '2', target: '5', sourceHandle: 'success', targetHandle: 'top', type: 'workflow', data: { type: 'success', sequence: 4 } },
      { id: 'e3-4', source: '3', target: '4', sourceHandle: 'failure', targetHandle: 'top', type: 'workflow', data: { type: 'failure', sequence: 5 } },
      { id: 'e5-4', source: '5', target: '4', sourceHandle: 'success', targetHandle: 'top', type: 'workflow', data: { type: 'success', sequence: 6 } },
      { id: 'e5-6', source: '5', target: '6', sourceHandle: 'success', targetHandle: 'top', type: 'workflow', data: { type: 'success', sequence: 7 } }
    ]
  },

  {
    id: 'WF-002',
    code: 'WF-002',
    name: 'Deploy Configuration',
    description: 'Push staged config dari template ke target devices via SFTP/SCP.',
    schedule: 'Manual',
    steps: 4,
    status: 'REQ',
    statusColor: 'amber',
    riskLevel: 'MEDIUM',
    nodes: [
      {
        id: '1', type: 'workflow', position: { x: 200, y: 50 },
        data: {
          nodeType: 'command',
          label: '1. Validasi template config',
          subtitle: '3 command(s)',
          commands: [
            { text: 'cat /etc/noc/templates/{template_name}' },
            { text: 'envsubst < template.cfg > /tmp/rendered.cfg' },
            { text: 'diff /tmp/rendered.cfg /tmp/prev.cfg' }
          ]
        }
      },
      {
        id: '2', type: 'workflow', position: { x: 100, y: 250 },
        data: {
          nodeType: 'function',
          label: '2. Function getDeviceList',
          subtitle: 'getDeviceList',
          params: 'getDeviceList',
          bound: '1 BOUND'
        }
      },
      {
        id: '3', type: 'workflow', position: { x: 350, y: 250 },
        data: {
          nodeType: 'command',
          label: '3. Backup config lama',
          subtitle: '2 command(s)',
          commands: [
            { text: 'scp {device_ip}:/etc/config backup/{device}_{date}.cfg' },
            { text: 'echo "BACKUP OK device={device.hostname}"' }
          ]
        }
      },
      {
        id: '4', type: 'workflow', position: { x: 200, y: 450 },
        data: {
          nodeType: 'command',
          label: '4. Push config baru ke device',
          subtitle: '3 command(s)',
          commands: [
            { text: 'scp /tmp/rendered.cfg {device_ip}:/etc/config' },
            { text: 'ssh {device_ip} "service network restart"' },
            { text: 'echo "DEPLOY OK to {device.hostname}"' }
          ]
        }
      },
      {
        id: '5', type: 'workflow', position: { x: 200, y: 650 },
        data: {
          nodeType: 'command',
          label: '5. Verifikasi post-deploy',
          subtitle: '2 command(s)',
          commands: [
            { text: 'ping -c 3 {device_ip}' },
            { text: 'ssh {device_ip} "cat /etc/config | grep version"' }
          ]
        }
      }
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2', sourceHandle: 'success', targetHandle: 'top', type: 'workflow', data: { type: 'success', sequence: 1 } },
      { id: 'e1-3', source: '1', target: '3', sourceHandle: 'success', targetHandle: 'top', type: 'workflow', data: { type: 'success', sequence: 2 } },
      { id: 'e2-4', source: '2', target: '4', sourceHandle: 'success', targetHandle: 'top', type: 'workflow', data: { type: 'success', sequence: 3 } },
      { id: 'e3-4', source: '3', target: '4', sourceHandle: 'success', targetHandle: 'top', type: 'workflow', data: { type: 'success', sequence: 4 } },
      { id: 'e4-5', source: '4', target: '5', sourceHandle: 'success', targetHandle: 'top', type: 'workflow', data: { type: 'success', sequence: 5 } },
      { id: 'e4-fail', source: '4', target: '3', sourceHandle: 'failure', targetHandle: 'top', type: 'workflow', data: { type: 'failure', sequence: 6 } }
    ]
  },

  {
    id: 'WF-003',
    code: 'WF-003',
    name: 'Security Audit',
    description: 'Compliance scan: CIS benchmarks, ACL review, unused port check.',
    schedule: 'Weekly Mon',
    steps: 8,
    status: 'OFF',
    statusColor: 'gray',
    riskLevel: 'CRITICAL',
    nodes: [
      {
        id: '1', type: 'workflow', position: { x: 200, y: 50 },
        data: {
          nodeType: 'command',
          label: '1. Scan port terbuka',
          subtitle: '2 command(s)',
          commands: [
            { text: "ss -tlnp | awk '{print $4}'" },
            { text: 'netstat -an | grep LISTEN' }
          ]
        }
      },
      {
        id: '2', type: 'workflow', position: { x: 50, y: 250 },
        data: {
          nodeType: 'command',
          label: '2. Review ACL & firewall rules',
          subtitle: '3 command(s)',
          commands: [
            { text: 'iptables -L -n --line-numbers' },
            { text: 'ip6tables -L -n --line-numbers' },
            { text: 'cat /etc/hosts.allow /etc/hosts.deny' }
          ]
        }
      },
      {
        id: '3', type: 'workflow', position: { x: 350, y: 250 },
        data: {
          nodeType: 'command',
          label: '3. CIS Benchmark check',
          subtitle: '4 command(s)',
          commands: [
            { text: 'grep "PermitRootLogin" /etc/ssh/sshd_config' },
            { text: 'grep "PasswordAuthentication" /etc/ssh/sshd_config' },
            { text: 'auditctl -l' },
            { text: 'chkconfig --list 2>/dev/null | grep ":on"' }
          ]
        }
      },
      {
        id: '4', type: 'workflow', position: { x: 50, y: 470 },
        data: {
          nodeType: 'command',
          label: '4. Cek user & privilege',
          subtitle: '2 command(s)',
          commands: [
            { text: "getent passwd | awk -F: '$3==0{print}'" },
            { text: 'grep -v "^#" /etc/sudoers' }
          ]
        }
      },
      {
        id: '5', type: 'workflow', position: { x: 350, y: 470 },
        data: {
          nodeType: 'function',
          label: '5. Function sendAuditReport',
          subtitle: 'sendAuditReport',
          params: 'sendAuditReport',
          bound: '2 BOUND'
        }
      },
      {
        id: '6', type: 'workflow', position: { x: 200, y: 670 },
        data: {
          nodeType: 'command',
          label: '6. Generate laporan keamanan',
          subtitle: '2 command(s)',
          commands: [
            { text: 'echo "AUDIT_RESULT host={hostname} score={score}"' },
            { text: 'curl -X POST {webhook_url} -d @/tmp/audit.json' }
          ]
        }
      }
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2', sourceHandle: 'success', targetHandle: 'top', type: 'workflow', data: { type: 'success', sequence: 1 } },
      { id: 'e1-3', source: '1', target: '3', sourceHandle: 'success', targetHandle: 'top', type: 'workflow', data: { type: 'success', sequence: 2 } },
      { id: 'e2-4', source: '2', target: '4', sourceHandle: 'success', targetHandle: 'top', type: 'workflow', data: { type: 'success', sequence: 3 } },
      { id: 'e3-5', source: '3', target: '5', sourceHandle: 'success', targetHandle: 'top', type: 'workflow', data: { type: 'success', sequence: 4 } },
      { id: 'e4-5', source: '4', target: '5', sourceHandle: 'success', targetHandle: 'top', type: 'workflow', data: { type: 'success', sequence: 5 } },
      { id: 'e5-6', source: '5', target: '6', sourceHandle: 'success', targetHandle: 'top', type: 'workflow', data: { type: 'success', sequence: 6 } },
      { id: 'e3-fail', source: '3', target: '6', sourceHandle: 'failure', targetHandle: 'top', type: 'workflow', data: { type: 'failure', sequence: 7 } }
    ]
  },

  {
    id: 'WF-004',
    code: 'WF-004',
    name: 'Inventory Sync',
    description: 'Pull device facts ke CMDB. Trigger saat ada perubahan topology.',
    schedule: 'Hourly',
    steps: 7,
    status: 'LIVE',
    statusColor: 'green',
    riskLevel: 'HIGH',
    nodes: [
      {
        id: '1', type: 'workflow', position: { x: 200, y: 50 },
        data: {
          nodeType: 'command',
          label: '1. Collect device facts',
          subtitle: '3 command(s)',
          commands: [
            { text: 'snmpwalk -v2c -c {community} {device_ip} system' },
            { text: 'ssh {device_ip} "show version"' },
            { text: 'lldpctl -f json' }
          ]
        }
      },
      {
        id: '2', type: 'workflow', position: { x: 200, y: 280 },
        data: {
          nodeType: 'function',
          label: '2. Function updateCMDB',
          subtitle: 'updateCMDB',
          params: 'updateCMDB',
          bound: '3 BOUND'
        }
      },
      {
        id: '3', type: 'workflow', position: { x: 200, y: 510 },
        data: {
          nodeType: 'command',
          label: '3. Verifikasi & notifikasi sync',
          subtitle: '2 command(s)',
          commands: [
            { text: 'curl {cmdb_api}/verify/{device_id}' },
            { text: 'echo "SYNC_OK device={device.hostname} ts={timestamp}"' }
          ]
        }
      }
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2', sourceHandle: 'success', targetHandle: 'top', type: 'workflow', data: { type: 'success', sequence: 1 } },
      { id: 'e2-3', source: '2', target: '3', sourceHandle: 'success', targetHandle: 'top', type: 'workflow', data: { type: 'success', sequence: 2 } },
      { id: 'e2-fail', source: '2', target: '1', sourceHandle: 'failure', targetHandle: 'top', type: 'workflow', data: { type: 'failure', sequence: 3 } }
    ]
  },

  {
    id: 'WF-005',
    code: 'WF-005',
    name: 'Service Health Check',
    description: 'Cek status service kritis, restart otomatis jika down, notifikasi NOC.',
    schedule: 'Every 5m',
    steps: 5,
    status: 'AUTO',
    statusColor: 'cyan',
    riskLevel: 'LOW',
    nodes: [
      {
        id: '1', type: 'workflow', position: { x: 200, y: 50 },
        data: {
          nodeType: 'command',
          label: '1. Cek status services',
          subtitle: '3 command(s)',
          commands: [
            { text: 'systemctl is-active {service_name}' },
            { text: 'ps aux | grep {service_name}' },
            { text: 'curl -s -o /dev/null -w "%{http_code}" {health_url}' }
          ]
        }
      },
      {
        id: '2', type: 'workflow', position: { x: 50, y: 280 },
        data: {
          nodeType: 'command',
          label: '2. Restart service',
          subtitle: '2 command(s)',
          conditionLabel: 'IF: SERVICE == DOWN',
          conditionType: 'false',
          commands: [
            { text: 'systemctl restart {service_name}' },
            { text: 'sleep 5 && systemctl is-active {service_name}' }
          ]
        }
      },
      {
        id: '3', type: 'workflow', position: { x: 350, y: 280 },
        data: {
          nodeType: 'command',
          label: '3. Service UP — log status',
          subtitle: '1 command(s)',
          commands: [
            { text: 'echo "HEALTH_OK service={service_name} host={hostname}"' }
          ]
        }
      },
      {
        id: '4', type: 'workflow', position: { x: 50, y: 500 },
        data: {
          nodeType: 'function',
          label: '4. Function notifyNOC',
          subtitle: 'notifyNOC',
          params: 'notifyNOC',
          bound: '1 BOUND'
        }
      },
      {
        id: '5', type: 'workflow', position: { x: 200, y: 700 },
        data: {
          nodeType: 'command',
          label: '5. Audit health check result',
          subtitle: '1 command(s)',
          commands: [
            { text: 'curl -X POST {noc_webhook} -d "{status: {status}, host: {hostname}}"' }
          ]
        }
      }
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2', sourceHandle: 'failure', targetHandle: 'top', type: 'workflow', data: { type: 'failure', sequence: 1 } },
      { id: 'e1-3', source: '1', target: '3', sourceHandle: 'success', targetHandle: 'top', type: 'workflow', data: { type: 'success', sequence: 2 } },
      { id: 'e2-4', source: '2', target: '4', sourceHandle: 'success', targetHandle: 'top', type: 'workflow', data: { type: 'success', sequence: 3 } },
      { id: 'e2-fail', source: '2', target: '4', sourceHandle: 'failure', targetHandle: 'top', type: 'workflow', data: { type: 'failure', sequence: 4 } },
      { id: 'e3-5', source: '3', target: '5', sourceHandle: 'success', targetHandle: 'top', type: 'workflow', data: { type: 'success', sequence: 5 } },
      { id: 'e4-5', source: '4', target: '5', sourceHandle: 'success', targetHandle: 'top', type: 'workflow', data: { type: 'success', sequence: 6 } }
    ]
  }
]

export default workflowCatalogs
