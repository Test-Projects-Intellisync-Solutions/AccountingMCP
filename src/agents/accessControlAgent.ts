/**
 * Access Control Agent
 * Manages permissions for users, roles, and data access within the system.
 * Enforces security policies for sensitive operations.
 */
import type { ToolResult } from "../modelcontextprotocol/tool";
import { createAgent } from "./BaseAgent";

export type AccessPolicy = { role: string; permissions: string[] };
export type AccessLog = { user: string; action: string; resource: string; timestamp: string };

interface AccessControlAgentResources {
  policies: AccessPolicy[];
  accessLogs: AccessLog[];
}

interface AccessControlAgentTools {
  checkPermissions: (userId: string, resource: string, requestedAction: string) => ToolResult | Promise<ToolResult>;
  logAccess: (log: AccessLog) => ToolResult | Promise<ToolResult>;
  listRoles: (userId: string) => ToolResult | Promise<ToolResult>;
  auditAccessLog: () => ToolResult | Promise<ToolResult>;
}

interface AccessControlAgentPrompts {
  checkPermissions: {
    messages: [
      { role: "user", content: { type: "text", text: "Check the access permissions for this user and resource. Specify the user's role in the response." } }
    ]
  };
  listUserRoles: {
    messages: [
      { role: "user", content: { type: "text", text: "List all roles for user <userId>." } }
    ]
  };
  grantPermission: {
    messages: [
      { role: "user", content: { type: "text", text: "Grant <permission> on <resource> to user <userId>." } }
    ]
  };
  revokePermission: {
    messages: [
      { role: "user", content: { type: "text", text: "Revoke <permission> on <resource> from user <userId>." } }
    ]
  };
  auditAccessLog: {
    messages: [
      { role: "user", content: { type: "text", text: "Show audit log entries for access control events, including all access attempts." } }
    ]
  };
  simulatePermissionCheck: {
    messages: [
      { role: "user", content: { type: "text", text: "If user <userId> (role: <role>) attempts to <action> a <resource> on <condition>, what is the result?" } }
    ]
  };
  showRoleHierarchy: {
    messages: [
      { role: "user", content: { type: "text", text: "Display all roles inheriting from <role>, in order of privilege." } }
    ]
  };
  summarizeAuditTrail: {
    messages: [
      { role: "user", content: { type: "text", text: "Provide a one-paragraph summary of all denied attempts by user <userId> over the past <timeframe>." } }
    ]
  };
}

interface AccessControlAgent {
  resources: AccessControlAgentResources;
  tools: AccessControlAgentTools;
  prompts: AccessControlAgentPrompts;
  run: ({ parameters, context }: { parameters: any; context: any }) => Promise<ToolResult>;
}

const accessControlAgent: AccessControlAgent = createAgent({
  resources: {
    policies: [],
    accessLogs: []
  },
  tools: {
    checkPermissions: (userId: string, resource: string, requestedAction: string): ToolResult | Promise<ToolResult> => {
      // In-memory user-role mapping (replace with DB lookup)
      const userRoles: Record<string, string> = {
        '1': 'admin',
        '2': 'user',
        '3': 'auditor',
      };
      // In-memory role-permissions mapping (replace with DB or Vector DB)
      const rolePermissions: Record<string, string[]> = {
        admin:    ["read", "write", "delete", "audit"],
        user:     ["read", "write"],
        auditor:  ["read", "audit"],
      };
      const role = userRoles[userId];
      if (!role) return { success: false, result: { message: `No role found for userId: ${userId}` } };
      const permissions = rolePermissions[role] || [];
      const allowed = permissions.includes(requestedAction);
      // Optionally log access attempt
      accessControlAgent.resources.accessLogs.push({ user: userId, action: requestedAction, resource, timestamp: new Date().toISOString() });
      return {
        success: allowed,
        result: {
          allowed,
          userId,
          role,
          resource,
          requestedAction,
          message: allowed ? `Access granted: ${role} can ${requestedAction} on ${resource}.` : `Access denied: ${role} cannot ${requestedAction} on ${resource}.`
        }
      };
    },
    logAccess: (log: AccessLog): ToolResult | Promise<ToolResult> => {
      accessControlAgent.resources.accessLogs.push(log);
      return { success: true, result: { message: "Access log entry added." } };
    },
    listRoles: (userId: string): ToolResult | Promise<ToolResult> => {
      // Example: list all roles for a user
      const userRoles: Record<string, string> = {
        '1': 'admin',
        '2': 'user',
        '3': 'auditor',
      };
      return { success: true, result: { roles: [userRoles[userId] || 'unknown'] } };
    },
    auditAccessLog: (): ToolResult | Promise<ToolResult> => {
      return { success: true, result: accessControlAgent.resources.accessLogs };
    }
  },
  prompts: {
    checkPermissions: {
      messages: [
        { role: "user", content: { type: "text", text: "Check the access permissions for this user and resource. Specify the user's role in the response." } }
      ]
    },
    listUserRoles: {
      messages: [
        { role: "user", content: { type: "text", text: "List all roles for user <userId>." } }
      ]
    },
    grantPermission: {
      messages: [
        { role: "user", content: { type: "text", text: "Grant <permission> on <resource> to user <userId>." } }
      ]
    },
    revokePermission: {
      messages: [
        { role: "user", content: { type: "text", text: "Revoke <permission> on <resource> from user <userId>." } }
      ]
    },
    auditAccessLog: {
      messages: [
        { role: "user", content: { type: "text", text: "Show audit log entries for access control events, including all access attempts." } }
      ]
    },
    simulatePermissionCheck: {
      messages: [
        { role: "user", content: { type: "text", text: "If user <userId> (role: <role>) attempts to <action> a <resource> on <condition>, what is the result?" } }
      ]
    },
    showRoleHierarchy: {
      messages: [
        { role: "user", content: { type: "text", text: "Display all roles inheriting from <role>, in order of privilege." } }
      ]
    },
    summarizeAuditTrail: {
      messages: [
        { role: "user", content: { type: "text", text: "Provide a one-paragraph summary of all denied attempts by user <userId> over the past <timeframe>." } }
      ]
    }
  },
  run: async () => ({ success: false, result: { message: 'Not implemented' } })
});

// Type guard for Promise
function isPromise<T>(val: any): val is Promise<T> {
  return !!val && typeof val.then === "function";
}

// Attach a run method for orchestrated agent calls
accessControlAgent.run = async function({ parameters, context }: { parameters: any; context: any }): Promise<ToolResult> {
  const { action, payload } = parameters || {};
  const tools = this.tools as Record<string, (...args: any[]) => ToolResult | Promise<ToolResult>>;
  if (!action || typeof tools[action] !== "function") {
    return { success: false, result: { message: `Invalid or missing action: '${action}'` } };
  }
  try {
    const toolFn = tools[action];
    let result;
    if (Array.isArray(payload)) {
      result = toolFn.apply(this, payload);
    } else if (payload && typeof payload === "object") {
      result = toolFn.call(this, ...(Object.values(payload)));
    } else {
      result = toolFn.call(this, payload);
    }
    if (isPromise<ToolResult>(result)) {
      result = await result;
    }
    return result;
  } catch (err: any) {
    return { success: false, result: { message: err?.message || "AccessControlAgent run error" } };
  }
};

export { accessControlAgent };
